import mongoose from "mongoose";

const billParticipantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      required: [true, "Bill description is required"],
      trim: true,
      minlength: [2, "Description must be at least 2 characters"],
      maxlength: [100, "Description cannot exceed 100 characters"],
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0.01, "Total amount must be greater than 0"],
    },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },
    },

    participants: {
      type: [billParticipantSchema],
      required: true,

      validate: {
        validator: function (value) {
          return value.length >= 1;
        },
        message: "At least one participant is required",
      },
    },

    splitType: {
      type: String,
      enum: ["equal", "percentage"],
      default: "equal",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Bill", billSchema);