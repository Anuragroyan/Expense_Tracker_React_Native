import Bill from "../models/Bill.js";
import User from "../models/User.js";

// ======================================================
// HELPER
// ======================================================

const getUserId = req => {
  /*
   * Your auth middleware currently stores:
   *
   * req.user = decoded.userId
   *
   * So req.user is already the MongoDB User ID.
   */

  return req.user;
};

// ======================================================
// CALCULATE DISCOUNT
// ======================================================

export const calculateDiscount = totalAmount => {
  let discountPercent = 0;

  if (totalAmount > 1000) {
    discountPercent = 30;
  } else if (totalAmount > 500) {
    discountPercent = 20;
  } else if (totalAmount > 200) {
    discountPercent = 10;
  }

  const discountAmount = Number(
    ((totalAmount * discountPercent) / 100).toFixed(2)
  );

  const finalAmount = Number(
    (totalAmount - discountAmount).toFixed(2)
  );

  return {
    discountPercent,
    discountAmount,
    finalAmount,
  };
};

// ======================================================
// CALCULATE SPLIT
// ======================================================

export const calculateSplit = ({
  participants,
  finalAmount,
  splitType,
}) => {
  if (
    !Array.isArray(participants) ||
    participants.length === 0
  ) {
    throw new Error(
      "At least one participant is required"
    );
  }

  // ====================================================
  // EQUAL SPLIT
  // ====================================================

  if (splitType === "equal") {
    const count = participants.length;

    const equalAmount = Number(
      (finalAmount / count).toFixed(2)
    );

    const participantData =
      participants.map(user => ({
        userId: user._id,
        name: user.name,
        percentage: Number(
          (100 / count).toFixed(2)
        ),
        amount: equalAmount,
      }));

    // -----------------------------------------------
    // FIX ROUNDING DIFFERENCE
    // -----------------------------------------------

    const calculatedTotal = Number(
      (equalAmount * count).toFixed(2)
    );

    const difference = Number(
      (finalAmount - calculatedTotal).toFixed(2)
    );

    if (difference !== 0) {
      const lastParticipant =
        participantData[
          participantData.length - 1
        ];

      lastParticipant.amount = Number(
        (
          lastParticipant.amount +
          difference
        ).toFixed(2)
      );
    }

    return participantData;
  }

  // ====================================================
  // PERCENTAGE SPLIT
  // ====================================================

  if (splitType === "percentage") {
    const percentageTotal =
      participants.reduce(
        (sum, participant) =>
          sum +
          Number(
            participant.percentage || 0
          ),
        0
      );

    if (
      Math.abs(
        percentageTotal - 100
      ) > 0.01
    ) {
      throw new Error(
        `Percentage split must equal 100%. Current total: ${percentageTotal}%`
      );
    }

    const participantData =
      participants.map(participant => {
        const percentage =
          Number(
            participant.percentage
          );

        if (
          percentage <= 0 ||
          percentage > 100
        ) {
          throw new Error(
            `Invalid percentage for ${participant.name}`
          );
        }

        const amount = Number(
          (
            (finalAmount *
              percentage) /
            100
          ).toFixed(2)
        );

        return {
          userId: participant._id,
          name: participant.name,
          percentage,
          amount,
        };
      });

    // -----------------------------------------------
    // FIX ROUNDING DIFFERENCE
    // -----------------------------------------------

    const calculatedTotal =
      participantData.reduce(
        (sum, participant) =>
          sum + participant.amount,
        0
      );

    const difference = Number(
      (
        finalAmount -
        calculatedTotal
      ).toFixed(2)
    );

    if (difference !== 0) {
      const lastParticipant =
        participantData[
          participantData.length - 1
        ];

      lastParticipant.amount =
        Number(
          (
            lastParticipant.amount +
            difference
          ).toFixed(2)
        );
    }

    return participantData;
  }

  throw new Error(
    "Invalid split type. Use 'equal' or 'percentage'."
  );
};

// ======================================================
// CREATE BILL
// ======================================================

export const createBill = async (
  req,
  res
) => {
  try {
    const {
      description,
      totalAmount,
      participants,
      paidBy,
      splitType = "equal",
    } = req.body;

    console.log(
      "========== CREATE BILL =========="
    );

    console.log(
      "REQUEST USER:",
      req.user
    );

    console.log(
      "PAID BY:",
      paidBy
    );

    console.log(
      "PARTICIPANTS:",
      participants
    );

    // ==================================================
    // DESCRIPTION
    // ==================================================

    if (
      !description ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Bill description is required",
      });
    }

    // ==================================================
    // AMOUNT
    // ==================================================

    const numericTotalAmount =
      Number(totalAmount);

    if (
      Number.isNaN(
        numericTotalAmount
      ) ||
      numericTotalAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Total amount must be greater than 0",
      });
    }

    // ==================================================
    // SPLIT TYPE
    // ==================================================

    if (
      !["equal", "percentage"].includes(
        splitType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid split type. Use 'equal' or 'percentage'",
      });
    }

    // ==================================================
    // PARTICIPANTS
    // ==================================================

    if (
      !Array.isArray(participants) ||
      participants.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one participant is required",
      });
    }

    const participantIds =
      participants.map(
        participant =>
          participant.userId
      );

    // ==================================================
    // CHECK PARTICIPANT IDs
    // ==================================================

    if (
      participantIds.some(
        id => !id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Every participant must have a valid user ID",
      });
    }

    // ==================================================
    // CHECK DUPLICATE PARTICIPANTS
    // ==================================================

    const uniqueParticipantIds =
      new Set(
        participantIds.map(id =>
          id.toString()
        )
      );

    if (
      uniqueParticipantIds.size !==
      participantIds.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate participants are not allowed",
      });
    }

    // ==================================================
    // PAYER
    // ==================================================

    /*
     * Frontend sends:
     *
     * paidBy: {
     *   userId: "...",
     *   name: "..."
     * }
     */

    const payerId =
      typeof paidBy === "object"
        ? paidBy?.userId
        : paidBy;

    if (!payerId) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a payer",
      });
    }

    // ==================================================
    // PAYER MUST BE PARTICIPANT
    // ==================================================

    const payerIsParticipant =
      participantIds.some(
        id =>
          id.toString() ===
          payerId.toString()
      );

    if (!payerIsParticipant) {
      return res.status(400).json({
        success: false,
        message:
          "Payer must be one of the participants",
      });
    }

    // ==================================================
    // FETCH PAYER FROM DATABASE
    // ==================================================

    const payer =
      await User.findById(
        payerId
      ).select("_id name email");

    if (!payer) {
      return res.status(404).json({
        success: false,
        message:
          "Payer not found",
      });
    }

    // ==================================================
    // FETCH PARTICIPANTS FROM DATABASE
    // ==================================================

    const users =
      await User.find({
        _id: {
          $in: participantIds,
        },
      }).select(
        "_id name email"
      );

    if (
      users.length !==
      participantIds.length
    ) {
      return res.status(404).json({
        success: false,
        message:
          "One or more participants not found",
      });
    }

    // ==================================================
    // DISCOUNT
    // ==================================================

    const {
      discountPercent,
      discountAmount,
      finalAmount,
    } =
      calculateDiscount(
        numericTotalAmount
      );

    // ==================================================
    // PREPARE PARTICIPANTS
    // ==================================================

    let splitParticipants;

    if (
      splitType ===
      "percentage"
    ) {
      splitParticipants =
        users.map(user => {
          const inputParticipant =
            participants.find(
              participant =>
                participant.userId.toString() ===
                user._id.toString()
            );

          if (!inputParticipant) {
            throw new Error(
              `Percentage information missing for ${user.name}`
            );
          }

          return {
            ...user.toObject(),

            percentage:
              Number(
                inputParticipant.percentage
              ),
          };
        });
    } else {
      splitParticipants =
        users;
    }

    // ==================================================
    // CALCULATE SPLIT
    // ==================================================

    const participantData =
      calculateSplit({
        participants:
          splitParticipants,

        finalAmount,

        splitType,
      });

    // ==================================================
    // CREATE BILL
    // ==================================================

    const bill =
      await Bill.create({
        createdBy:
          getUserId(req),

        description:
          description.trim(),

        totalAmount:
          numericTotalAmount,

        discountPercent,

        discountAmount,

        finalAmount,

        // Name is fetched from DB
        paidBy: {
          userId:
            payer._id,

          name:
            payer.name,
        },

        // Names are fetched from DB
        participants:
          participantData,

        splitType,
      });

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,
      message:
        "Bill created successfully",
      bill,
    });
  } catch (error) {
    console.error(
      "CREATE BILL ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create bill",
    });
  }
};

// ======================================================
// GET ALL BILLS
// ======================================================

export const getBills = async (
  req,
  res
) => {
  try {
    const userId =
      getUserId(req);

    /*
     * User can see:
     *
     * 1. Bills created by the user
     * 2. Bills where the user is a participant
     */

    const bills =
      await Bill.find({
        $or: [
          {
            createdBy: userId,
          },

          {
            "participants.userId":
              userId,
          },
        ],
      })
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        bills.length,

      bills,
    });
  } catch (error) {
    console.error(
      "GET BILLS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch bills",
    });
  }
};

// ======================================================
// GET SINGLE BILL
// ======================================================

export const getBillById =
  async (req, res) => {
    try {
      const userId =
        getUserId(req);

      /*
       * User can open the bill only if:
       *
       * - They created it
       * OR
       * - They are a participant
       */

      const bill =
        await Bill.findOne({
          _id:
            req.params.id,

          $or: [
            {
              createdBy:
                userId,
            },

            {
              "participants.userId":
                userId,
            },
          ],
        }).populate(
          "createdBy",
          "name email"
        );

      if (!bill) {
        return res.status(404).json({
          success: false,
          message:
            "Bill not found or you do not have access to it",
        });
      }

      return res.status(200).json({
        success: true,
        bill,
      });
    } catch (error) {
      console.error(
        "GET BILL ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch bill",
      });
    }
  };

// ======================================================
// UPDATE BILL
// ======================================================

export const updateBill =
  async (req, res) => {
    try {
      const {
        description,
        totalAmount,
        participants,
        paidBy,
        splitType = "equal",
      } = req.body;

      const userId =
        getUserId(req);

      // ==================================================
      // BASIC VALIDATION
      // ==================================================

      if (
        !description ||
        !description.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Bill description is required",
        });
      }

      const numericTotalAmount =
        Number(totalAmount);

      if (
        Number.isNaN(
          numericTotalAmount
        ) ||
        numericTotalAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Total amount must be greater than 0",
        });
      }

      if (
        !["equal", "percentage"].includes(
          splitType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid split type. Use 'equal' or 'percentage'",
        });
      }

      // ==================================================
      // FIND BILL
      // ==================================================

      /*
       * IMPORTANT:
       *
       * Only the creator can update.
       */

      const bill =
        await Bill.findOne({
          _id:
            req.params.id,

          createdBy:
            userId,
        });

      if (!bill) {
        return res.status(404).json({
          success: false,
          message:
            "Bill not found or you are not the creator",
        });
      }

      // ==================================================
      // PARTICIPANTS
      // ==================================================

      if (
        !Array.isArray(participants) ||
        participants.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one participant is required",
        });
      }

      const participantIds =
        participants.map(
          participant =>
            participant.userId
        );

      // ==================================================
      // DUPLICATE CHECK
      // ==================================================

      const uniqueParticipantIds =
        new Set(
          participantIds.map(id =>
            id.toString()
          )
        );

      if (
        uniqueParticipantIds.size !==
        participantIds.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Duplicate participants are not allowed",
        });
      }

      // ==================================================
      // PAYER
      // ==================================================

      const payerId =
        typeof paidBy === "object"
          ? paidBy?.userId
          : paidBy;

      if (!payerId) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a payer",
        });
      }

      // ==================================================
      // PAYER MUST BE PARTICIPANT
      // ==================================================

      const payerIsParticipant =
        participantIds.some(
          id =>
            id.toString() ===
            payerId.toString()
        );

      if (!payerIsParticipant) {
        return res.status(400).json({
          success: false,
          message:
            "Payer must be one of the participants",
        });
      }

      // ==================================================
      // FETCH PAYER
      // ==================================================

      const payer =
        await User.findById(
          payerId
        ).select(
          "_id name email"
        );

      if (!payer) {
        return res.status(404).json({
          success: false,
          message:
            "Payer not found",
        });
      }

      // ==================================================
      // FETCH PARTICIPANTS
      // ==================================================

      const users =
        await User.find({
          _id: {
            $in: participantIds,
          },
        }).select(
          "_id name email"
        );

      if (
        users.length !==
        participantIds.length
      ) {
        return res.status(404).json({
          success: false,
          message:
            "One or more participants not found",
        });
      }

      // ==================================================
      // DISCOUNT
      // ==================================================

      const {
        discountPercent,
        discountAmount,
        finalAmount,
      } =
        calculateDiscount(
          numericTotalAmount
        );

      // ==================================================
      // PREPARE PARTICIPANTS
      // ==================================================

      let splitParticipants;

      if (
        splitType ===
        "percentage"
      ) {
        splitParticipants =
          users.map(user => {
            const inputParticipant =
              participants.find(
                participant =>
                  participant.userId.toString() ===
                  user._id.toString()
              );

            if (!inputParticipant) {
              throw new Error(
                `Percentage information missing for ${user.name}`
              );
            }

            return {
              ...user.toObject(),

              percentage:
                Number(
                  inputParticipant.percentage
                ),
            };
          });
      } else {
        splitParticipants =
          users;
      }

      // ==================================================
      // CALCULATE SPLIT
      // ==================================================

      const participantData =
        calculateSplit({
          participants:
            splitParticipants,

          finalAmount,

          splitType,
        });

      // ==================================================
      // UPDATE BILL
      // ==================================================

      bill.description =
        description.trim();

      bill.totalAmount =
        numericTotalAmount;

      bill.discountPercent =
        discountPercent;

      bill.discountAmount =
        discountAmount;

      bill.finalAmount =
        finalAmount;

      bill.paidBy = {
        userId:
          payer._id,

        name:
          payer.name,
      };

      bill.participants =
        participantData;

      bill.splitType =
        splitType;

      await bill.save();

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        message:
          "Bill updated successfully",

        bill,
      });
    } catch (error) {
      console.error(
        "UPDATE BILL ERROR:",
        error
      );

      return res.status(400).json({
        success: false,

        message:
          error.message ||
          "Failed to update bill",
      });
    }
  };

// ======================================================
// DELETE BILL
// ======================================================

export const deleteBill =
  async (req, res) => {
    try {
      const userId =
        getUserId(req);

      /*
       * Only the creator can delete.
       */

      const bill =
        await Bill.findOneAndDelete({
          _id:
            req.params.id,

          createdBy:
            userId,
        });

      if (!bill) {
        return res.status(404).json({
          success: false,

          message:
            "Bill not found or you are not the creator",
        });
      }

      return res.status(200).json({
        success: true,

        message:
          "Bill deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE BILL ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to delete bill",
      });
    }
  };