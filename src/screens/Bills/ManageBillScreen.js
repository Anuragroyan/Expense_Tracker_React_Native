import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {
  addBill,
  editBill,
  removeBill,
} from '../../store/slices/billSlice';

import {getUsers} from '../../services/userService';

import colors from '../../constants/colors';

const ManageBillScreen = ({
  route,
  navigation,
}) => {
  const dispatch = useDispatch();

  const {loading} = useSelector(
    state => state.bills,
  );

  const existingBill =
    route.params?.bill;

  const isEditing =
    Boolean(existingBill);

  // ==================================================
  // USERS
  // ==================================================

  const [users, setUsers] =
    useState([]);

  const [usersLoading, setUsersLoading] =
    useState(true);

  // ==================================================
  // DROPDOWNS
  // ==================================================

  const [showPayerList, setShowPayerList] =
    useState(false);

  const [
    showParticipantList,
    setShowParticipantList,
  ] = useState(false);

  // ==================================================
  // FORM
  // ==================================================

  const [description, setDescription] =
    useState(
      existingBill?.description || '',
    );

  const [totalAmount, setTotalAmount] =
    useState(
      existingBill?.totalAmount !==
        undefined
        ? String(
            existingBill.totalAmount,
          )
        : '',
    );

  const [splitType, setSplitType] =
    useState(
      existingBill?.splitType ||
        'equal',
    );

  // ==================================================
  // PAYER
  // ==================================================

  const [paidBy, setPaidBy] =
    useState(
      existingBill?.paidBy
        ? {
            userId: String(
              existingBill.paidBy.userId,
            ),
            name:
              existingBill.paidBy.name,
          }
        : null,
    );

  // ==================================================
  // PARTICIPANTS
  // ==================================================

  const [
    participants,
    setParticipants,
  ] = useState(
    existingBill?.participants
      ? existingBill.participants.map(
          participant => ({
            userId: String(
              participant.userId,
            ),

            name:
              participant.name,

            percentage:
              Number(
                participant.percentage ||
                  0,
              ),

            amount:
              Number(
                participant.amount ||
                  0,
              ),
          }),
        )
      : [],
  );

  // ==================================================
  // SELECTED PARTICIPANT
  // ==================================================

  const [
    selectedParticipant,
    setSelectedParticipant,
  ] = useState(null);

  // ==================================================
  // TEMPORARY PERCENTAGE
  // ==================================================

  const [
    participantPercentage,
    setParticipantPercentage,
  ] = useState('');

  // ==================================================
  // FETCH USERS
  // ==================================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);

        const data =
          await getUsers();

        console.log(
          '========== USERS FROM BACKEND ==========',
        );

        console.log(
          JSON.stringify(
            data,
            null,
            2,
          ),
        );

        // Handle both:
        // response = []
        //
        // and:
        // response = { users: [] }

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (
          Array.isArray(data?.users)
        ) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.log(
          'GET USERS ERROR:',
          err?.response?.data ||
            err?.message ||
            err,
        );

        Alert.alert(
          'Error',
          err?.response?.data
            ?.message ||
            err?.message ||
            'Failed to fetch users.',
        );
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ==================================================
  // DISCOUNT
  // ==================================================

  const discountPercent =
    useMemo(() => {
      const amount =
        Number(totalAmount) || 0;

      if (amount > 1000) {
        return 30;
      }

      if (amount > 500) {
        return 20;
      }

      if (amount > 200) {
        return 10;
      }

      return 0;
    }, [totalAmount]);

  const discountAmount =
    useMemo(() => {
      const amount =
        Number(totalAmount) || 0;

      return Number(
        (
          (amount *
            discountPercent) /
          100
        ).toFixed(2),
      );
    }, [
      totalAmount,
      discountPercent,
    ]);

  const finalAmount =
    useMemo(() => {
      const amount =
        Number(totalAmount) || 0;

      return Number(
        (
          amount -
          discountAmount
        ).toFixed(2),
      );
    }, [
      totalAmount,
      discountAmount,
    ]);

  // ==================================================
  // SELECT PAYER
  // ==================================================

  const handleSelectPayer = user => {
    if (!user?._id) {
      Alert.alert(
        'Error',
        'Invalid user selected.',
      );

      return;
    }

    setPaidBy({
      userId: String(user._id),
      name: user.name,
    });

    setShowPayerList(false);
  };

  // ==================================================
  // START ADD PARTICIPANT
  // ==================================================

  const handleAddParticipant = () => {
    if (usersLoading) {
      return;
    }

    if (users.length === 0) {
      Alert.alert(
        'No Users',
        'No users are available.',
      );

      return;
    }

    setSelectedParticipant(null);

    setParticipantPercentage('');

    setShowParticipantList(true);

    setShowPayerList(false);
  };

  // ==================================================
  // SELECT PARTICIPANT
  // ==================================================

  const handleSelectParticipant = user => {
    if (!user?._id) {
      Alert.alert(
        'Error',
        'Invalid user selected.',
      );

      return;
    }

    const userId = String(
      user._id,
    );

    // ==================================================
    // DUPLICATE CHECK
    // ==================================================

    const alreadyExists =
      participants.some(
        participant =>
          String(
            participant.userId,
          ) === userId,
      );

    if (alreadyExists) {
      Alert.alert(
        'Already Added',
        `${user.name} is already a participant.`,
      );

      return;
    }

    // ==================================================
    // SELECT USER
    // ==================================================

    setSelectedParticipant({
      userId,
      name: user.name,
    });

    setParticipantPercentage('');

    setShowParticipantList(false);
  };

  // ==================================================
  // CONFIRM PARTICIPANT
  // ==================================================

  const handleConfirmParticipant =
    () => {
      if (!selectedParticipant) {
        Alert.alert(
          'Select Participant',
          'Please select a participant first.',
        );

        return;
      }

      let percentage = 0;

      // ==================================================
      // PERCENTAGE MODE
      // ==================================================

      if (
        splitType ===
        'percentage'
      ) {
        percentage = Number(
          participantPercentage,
        );

        if (
          !participantPercentage ||
          Number.isNaN(percentage) ||
          percentage <= 0 ||
          percentage > 100
        ) {
          Alert.alert(
            'Invalid Percentage',
            'Enter a percentage between 1 and 100.',
          );

          return;
        }

        const currentPercentage =
          participants.reduce(
            (
              total,
              participant,
            ) => {
              return (
                total +
                Number(
                  participant.percentage ||
                    0,
                )
              );
            },
            0,
          );

        const remaining =
          Number(
            (
              100 -
              currentPercentage
            ).toFixed(2),
          );

        if (
          percentage >
          remaining
        ) {
          Alert.alert(
            'Invalid Percentage',
            `Only ${remaining.toFixed(
              2,
            )}% is remaining.`,
          );

          return;
        }
      }

      // ==================================================
      // CREATE PARTICIPANT
      // ==================================================

      const newParticipant = {
        userId:
          selectedParticipant.userId,

        name:
          selectedParticipant.name,

        percentage,

        amount: 0,
      };

      setParticipants(
        previous => [
          ...previous,
          newParticipant,
        ],
      );

      // ==================================================
      // RESET
      // ==================================================

      setSelectedParticipant(null);

      setParticipantPercentage('');
    };

  // ==================================================
  // REMOVE PARTICIPANT
  // ==================================================

  const handleRemoveParticipant =
    userId => {
      setParticipants(
        previous =>
          previous.filter(
            participant =>
              String(
                participant.userId,
              ) !==
              String(userId),
          ),
      );
    };

  // ==================================================
  // CALCULATE PARTICIPANTS
  // ==================================================

  const calculatedParticipants =
    useMemo(() => {
      if (
        participants.length ===
        0
      ) {
        return [];
      }

      // ==================================================
      // EQUAL SPLIT
      // ==================================================

      if (
        splitType ===
        'equal'
      ) {
        const count =
          participants.length;

        const basePercentage =
          Math.floor(
            (100 / count) * 100,
          ) / 100;

        let percentageTotal = 0;

        return participants.map(
          (
            participant,
            index,
          ) => {
            let percentage =
              basePercentage;

            if (
              index ===
              count - 1
            ) {
              percentage =
                Number(
                  (
                    100 -
                    percentageTotal
                  ).toFixed(2),
                );
            }

            percentageTotal +=
              percentage;

            const amount =
              Number(
                (
                  (finalAmount *
                    percentage) /
                  100
                ).toFixed(2),
              );

            return {
              ...participant,
              percentage,
              amount,
            };
          },
        );
      }

      // ==================================================
      // PERCENTAGE SPLIT
      // ==================================================

      return participants.map(
        participant => {
          const percentage =
            Number(
              participant.percentage ||
                0,
            );

          const amount =
            Number(
              (
                (finalAmount *
                  percentage) /
                100
              ).toFixed(2),
            );

          return {
            ...participant,
            percentage,
            amount,
          };
        },
      );
    }, [
      participants,
      splitType,
      finalAmount,
    ]);

  // ==================================================
  // TOTAL PERCENTAGE
  // ==================================================

  const totalPercentage =
    useMemo(() => {
      return Number(
        participants
          .reduce(
            (
              total,
              participant,
            ) =>
              total +
              Number(
                participant.percentage ||
                  0,
              ),
            0,
          )
          .toFixed(2),
      );
    }, [participants]);

  // ==================================================
  // TOTAL SPLIT AMOUNT
  // ==================================================

  const totalSplitAmount =
    useMemo(() => {
      return Number(
        calculatedParticipants
          .reduce(
            (
              total,
              participant,
            ) =>
              total +
              Number(
                participant.amount ||
                  0,
              ),
            0,
          )
          .toFixed(2),
      );
    }, [
      calculatedParticipants,
    ]);

  // ==================================================
  // SAVE BILL
  // ==================================================

  const handleSave = async () => {
    console.log(
      '🔥 SAVE BILL BUTTON PRESSED',
    );

    try {
      const amount =
        Number(totalAmount);

      // ==================================================
      // VALIDATION
      // ==================================================

      if (!description.trim()) {
        Alert.alert(
          'Validation',
          'Please enter a bill description.',
        );

        return;
      }

      if (
        !amount ||
        Number.isNaN(amount) ||
        amount <= 0
      ) {
        Alert.alert(
          'Validation',
          'Please enter a valid amount.',
        );

        return;
      }

      if (!paidBy?.userId) {
        Alert.alert(
          'Validation',
          'Please select who paid the bill.',
        );

        return;
      }

      if (
        participants.length ===
        0
      ) {
        Alert.alert(
          'Validation',
          'Please add at least one participant.',
        );

        return;
      }

      // ==================================================
      // PAYER MUST BE PARTICIPANT
      // ==================================================

      const payerIsParticipant =
        participants.some(
          participant =>
            String(
              participant.userId,
            ) ===
            String(
              paidBy.userId,
            ),
        );

      if (!payerIsParticipant) {
        Alert.alert(
          'Validation',
          'The person who paid must also be a participant.',
        );

        return;
      }

      // ==================================================
      // PERCENTAGE VALIDATION
      // ==================================================

      if (
        splitType ===
        'percentage'
      ) {
        if (
          Math.abs(
            totalPercentage -
              100,
          ) > 0.01
        ) {
          Alert.alert(
            'Invalid Split',
            `Participant percentages must total 100%. Current total: ${totalPercentage.toFixed(
              2,
            )}%.`,
          );

          return;
        }
      }

      // ==================================================
      // VALIDATE SPLIT AMOUNT
      // ==================================================

      if (
        Math.abs(
          totalSplitAmount -
            finalAmount,
        ) > 0.02
      ) {
        Alert.alert(
          'Invalid Split',
          `Split total ₹${totalSplitAmount.toFixed(
            2,
          )} does not match final bill ₹${finalAmount.toFixed(
            2,
          )}.`,
        );

        return;
      }

      // ==================================================
      // PARTICIPANTS
      // ==================================================

      const billParticipants =
        calculatedParticipants.map(
          participant => ({
            userId:
              participant.userId,

            name:
              participant.name,

            percentage:
              Number(
                participant.percentage,
              ) || 0,

            amount:
              Number(
                participant.amount,
              ) || 0,
          }),
        );

      // ==================================================
      // BILL DATA
      // ==================================================

      const billData = {
        description:
          description.trim(),

        totalAmount:
          amount,

        discountPercent:
          Number(
            discountPercent,
          ) || 0,

        discountAmount:
          Number(
            discountAmount,
          ) || 0,

        finalAmount:
          Number(
            finalAmount,
          ) || 0,

        splitType:
          splitType ===
          'percentage'
            ? 'percentage'
            : 'equal',

        paidBy: {
          userId:
            paidBy.userId,

          name:
            paidBy.name,
        },

        participants:
          billParticipants,
      };

      // ==================================================
      // DEBUG
      // ==================================================

      console.log(
        '========================================',
      );

      console.log(
        'BILL DATA BEING SENT:',
      );

      console.log(
        JSON.stringify(
          billData,
          null,
          2,
        ),
      );

      console.log(
        '========================================',
      );

      // ==================================================
      // CREATE BILL
      // ==================================================

      if (!isEditing) {
        const result =
          await dispatch(
            addBill(billData),
          );

        console.log(
          'ADD BILL RESULT:',
          result,
        );

        // IMPORTANT:
        // Do not use addBill.fulfilled.match()
        // here.

        if (
          result?.meta
            ?.requestStatus ===
          'fulfilled'
        ) {
          Alert.alert(
            'Success',
            'Bill created successfully.',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.goBack(),
              },
            ],
          );
        } else {
          const message =
            result?.payload ||
            result?.error?.message ||
            'Failed to create bill';

          console.log(
            'CREATE BILL FAILED:',
            message,
          );

          Alert.alert(
            'Error',
            String(message),
          );
        }

        return;
      }

      // ==================================================
      // UPDATE BILL
      // ==================================================

      const result =
        await dispatch(
          editBill({
            id: existingBill._id,
            billData,
          }),
        );

      console.log(
        'EDIT BILL RESULT:',
        result,
      );

      if (
        result?.meta
          ?.requestStatus ===
        'fulfilled'
      ) {
        Alert.alert(
          'Success',
          'Bill updated successfully.',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.goBack(),
            },
          ],
        );
      } else {
        const message =
          result?.payload ||
          result?.error?.message ||
          'Failed to update bill';

        Alert.alert(
          'Error',
          String(message),
        );
      }
    } catch (error) {
      console.log(
        '🔥 SAVE BILL ERROR:',
        error,
      );

      Alert.alert(
        'Error',
        error?.response?.data
          ?.message ||
          error?.message ||
          'Failed to save bill.',
      );
    }
  };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = () => {
    if (!existingBill?._id) {
      return;
    }

    Alert.alert(
      'Delete Bill',
      'Are you sure you want to delete this bill?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              const result =
                await dispatch(
                  removeBill(
                    existingBill._id,
                  ),
                );

              console.log(
                'DELETE BILL RESULT:',
                result,
              );

              if (
                result?.meta
                  ?.requestStatus ===
                'fulfilled'
              ) {
                Alert.alert(
                  'Success',
                  'Bill deleted successfully.',
                  [
                    {
                      text: 'OK',
                      onPress: () =>
                        navigation.popToTop(),
                    },
                  ],
                );
              } else {
                const message =
                  result?.payload ||
                  result?.error?.message ||
                  'Failed to delete bill.';

                Alert.alert(
                  'Error',
                  String(message),
                );
              }
            } catch (error) {
              console.log(
                'DELETE BILL ERROR:',
                error,
              );

              Alert.alert(
                'Error',
                error?.message ||
                  'Failed to delete bill.',
              );
            }
          },
        },
      ],
    );
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <View style={styles.container}>
      {/* ==================================================
          HEADER
      ================================================== */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isEditing
            ? '✏️ Edit Bill'
            : '🧾 Add Bill'}
        </Text>

        <View
          style={styles.headerSpace}
        />
      </View>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <Text style={styles.label}>
          Bill Description
        </Text>

        <TextInput
          value={description}
          onChangeText={
            setDescription
          }
          placeholder="Dinner, Movie, Trip..."
          placeholderTextColor={
            colors.placeholder
          }
          style={styles.input}
        />

        {/* ==================================================
            TOTAL AMOUNT
        ================================================== */}

        <Text style={styles.label}>
          Total Amount
        </Text>

        <TextInput
          value={totalAmount}
          onChangeText={
            setTotalAmount
          }
          placeholder="₹ 0.00"
          placeholderTextColor={
            colors.placeholder
          }
          keyboardType="decimal-pad"
          style={styles.input}
        />

        {/* ==================================================
            DISCOUNT
        ================================================== */}

        <View
          style={
            styles.discountCard
          }
        >
          <View
            style={
              styles.discountInfo
            }
          >
            <Text
              style={
                styles.discountTitle
              }
            >
              🎟️ Discount
            </Text>

            <Text
              style={
                styles.discountDescription
              }
            >
              Automatic discount based on bill amount
            </Text>
          </View>

          <Text
            style={
              styles.discountPercent
            }
          >
            {discountPercent}%
          </Text>
        </View>

        <View style={styles.amountRow}>
          <Text
            style={
              styles.amountLabel
            }
          >
            Discount
          </Text>

          <Text
            style={
              styles.discountValue
            }
          >
            - ₹
            {discountAmount.toFixed(
              2,
            )}
          </Text>
        </View>

        <View style={styles.amountRow}>
          <Text
            style={
              styles.finalLabel
            }
          >
            Final Amount
          </Text>

          <Text
            style={
              styles.finalAmount
            }
          >
            ₹
            {finalAmount.toFixed(
              2,
            )}
          </Text>
        </View>

        {/* ==================================================
            PAYER
        ================================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          💳 Paid By
        </Text>

        <TouchableOpacity
          style={
            styles.selectInput
          }
          activeOpacity={0.7}
          onPress={() => {
            setShowPayerList(
              previous =>
                !previous,
            );

            setShowParticipantList(
              false,
            );
          }}
          disabled={usersLoading}
        >
          <Text
            style={
              paidBy
                ? styles.selectedText
                : styles.placeholderText
            }
          >
            {paidBy?.name ||
              'Select payer name'}
          </Text>

          <Text
            style={
              styles.dropdownArrow
            }
          >
            ▼
          </Text>
        </TouchableOpacity>

        {/* ==================================================
            PAYER DROPDOWN
        ================================================== */}

        {showPayerList && (
          <View
            style={
              styles.dropdown
            }
          >
            {usersLoading ? (
              <ActivityIndicator
                color={
                  colors.primary
                }
                style={
                  styles.dropdownLoader
                }
              />
            ) : users.length ===
              0 ? (
              <Text
                style={
                  styles.noUsersText
                }
              >
                No users found.
              </Text>
            ) : (
              users.map(user => (
                <TouchableOpacity
                  key={String(
                    user._id,
                  )}
                  style={
                    styles.userOption
                  }
                  activeOpacity={0.7}
                  onPress={() =>
                    handleSelectPayer(
                      user,
                    )
                  }
                >
                  <View
                    style={
                      styles.smallAvatar
                    }
                  >
                    <Text
                      style={
                        styles.smallAvatarText
                      }
                    >
                      {user.name
                        ?.charAt(
                          0,
                        )
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.userOptionInfo
                    }
                  >
                    <Text
                      style={
                        styles.userOptionName
                      }
                    >
                      {user.name}
                    </Text>

                    <Text
                      style={
                        styles.userOptionEmail
                      }
                    >
                      {user.email}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* ==================================================
            SPLIT TYPE
        ================================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          ⚖️ Split Type
        </Text>

        <View
          style={
            styles.splitContainer
          }
        >
          {/* EQUAL */}

          <TouchableOpacity
            style={[
              styles.splitButton,
              splitType ===
                'equal' &&
                styles.selectedSplitButton,
            ]}
            activeOpacity={0.7}
            onPress={() => {
              setSplitType(
                'equal',
              );

              setSelectedParticipant(
                null,
              );

              setParticipantPercentage(
                '',
              );

              setShowParticipantList(
                false,
              );
            }}
          >
            <Text
              style={[
                styles.splitButtonText,
                splitType ===
                  'equal' &&
                  styles.selectedSplitText,
              ]}
            >
              Equal
            </Text>
          </TouchableOpacity>

          {/* PERCENTAGE */}

          <TouchableOpacity
            style={[
              styles.splitButton,
              splitType ===
                'percentage' &&
                styles.selectedSplitButton,
            ]}
            activeOpacity={0.7}
            onPress={() => {
              setSplitType(
                'percentage',
              );

              setSelectedParticipant(
                null,
              );

              setParticipantPercentage(
                '',
              );

              setShowParticipantList(
                false,
              );
            }}
          >
            <Text
              style={[
                styles.splitButtonText,
                splitType ===
                  'percentage' &&
                  styles.selectedSplitText,
              ]}
            >
              Percentage
            </Text>
          </TouchableOpacity>
        </View>

        {/* ==================================================
            PARTICIPANTS
        ================================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          👥 Participants
        </Text>

        {/* ==================================================
            ADD PARTICIPANT
        ================================================== */}

        <TouchableOpacity
          style={
            styles.addParticipantButton
          }
          activeOpacity={0.7}
          onPress={
            handleAddParticipant
          }
          disabled={usersLoading}
        >
          <Text
            style={
              styles.addParticipantText
            }
          >
            + Add Participant
          </Text>
        </TouchableOpacity>

        {/* ==================================================
            PARTICIPANT DROPDOWN
        ================================================== */}

        {showParticipantList && (
          <View
            style={
              styles.dropdown
            }
          >
            {usersLoading ? (
              <ActivityIndicator
                color={
                  colors.primary
                }
                style={
                  styles.dropdownLoader
                }
              />
            ) : users.length ===
              0 ? (
              <Text
                style={
                  styles.noUsersText
                }
              >
                No users found.
              </Text>
            ) : (
              users.map(user => {
                const alreadySelected =
                  participants.some(
                    participant =>
                      String(
                        participant.userId,
                      ) ===
                      String(
                        user._id,
                      ),
                  );

                return (
                  <TouchableOpacity
                    key={String(
                      user._id,
                    )}
                    style={[
                      styles.userOption,
                      alreadySelected &&
                        styles.disabledUserOption,
                    ]}
                    activeOpacity={0.7}
                    disabled={
                      alreadySelected
                    }
                    onPress={() =>
                      handleSelectParticipant(
                        user,
                      )
                    }
                  >
                    <View
                      style={
                        styles.smallAvatar
                      }
                    >
                      <Text
                        style={
                          styles.smallAvatarText
                        }
                      >
                        {user.name
                          ?.charAt(
                            0,
                          )
                          .toUpperCase()}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.userOptionInfo
                      }
                    >
                      <Text
                        style={
                          styles.userOptionName
                        }
                      >
                        {user.name}
                      </Text>

                      <Text
                        style={
                          styles.userOptionEmail
                        }
                      >
                        {user.email}
                      </Text>
                    </View>

                    {alreadySelected && (
                      <Text
                        style={
                          styles.selectedMark
                        }
                      >
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        {/* ==================================================
            SELECTED PARTICIPANT
        ================================================== */}

        {selectedParticipant && (
          <View
            style={
              styles.selectedParticipantBox
            }
          >
            <Text
              style={
                styles.selectedParticipantLabel
              }
            >
              Selected Participant
            </Text>

            <View
              style={
                styles.selectedParticipantRow
              }
            >
              <View
                style={
                  styles.smallAvatar
                }
              >
                <Text
                  style={
                    styles.smallAvatarText
                  }
                >
                  {selectedParticipant.name
                    ?.charAt(0)
                    .toUpperCase()}
                </Text>
              </View>

              <Text
                style={
                  styles.selectedParticipantName
                }
              >
                {
                  selectedParticipant.name
                }
              </Text>
            </View>

            {/* ==================================================
                PERCENTAGE FIELD
                ONLY ENABLED IN PERCENTAGE MODE
            ================================================== */}

            {splitType ===
              'percentage' && (
              <>
                <Text
                  style={
                    styles.percentageLabel
                  }
                >
                  Percentage
                </Text>

                <TextInput
                  value={
                    participantPercentage
                  }
                  onChangeText={text => {
                    // Allow only numbers
                    // and one decimal point.

                    const cleaned =
                      text
                        .replace(
                          /[^0-9.]/g,
                          '',
                        )
                        .replace(
                          /(\..*)\./g,
                          '$1',
                        );

                    setParticipantPercentage(
                      cleaned,
                    );
                  }}
                  placeholder="Enter percentage"
                  placeholderTextColor={
                    colors.placeholder
                  }
                  keyboardType="decimal-pad"
                  style={
                    styles.input
                  }
                />
              </>
            )}

            {/* ==================================================
                CONFIRM PARTICIPANT
            ================================================== */}

            <TouchableOpacity
              style={
                styles.confirmParticipantButton
              }
              activeOpacity={0.7}
              onPress={
                handleConfirmParticipant
              }
            >
              <Text
                style={
                  styles.confirmParticipantText
                }
              >
                Add This Participant
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ==================================================
            PARTICIPANT CARDS
        ================================================== */}

        {participants.map(
          (
            participant,
            index,
          ) => {
            const calculated =
              calculatedParticipants[
                index
              ];

            return (
              <View
                key={`${participant.userId}-${index}`}
                style={
                  styles.participantCard
                }
              >
                <View
                  style={
                    styles.avatar
                  }
                >
                  <Text
                    style={
                      styles.avatarText
                    }
                  >
                    {participant.name
                      ?.charAt(
                        0,
                      )
                      .toUpperCase()}
                  </Text>
                </View>

                <View
                  style={
                    styles.participantInfo
                  }
                >
                  <Text
                    style={
                      styles.participantName
                    }
                  >
                    {
                      participant.name
                    }
                  </Text>

                  {splitType ===
                    'percentage' && (
                    <Text
                      style={
                        styles.participantPercentage
                      }
                    >
                      {Number(
                        participant.percentage ||
                          0,
                      ).toFixed(
                        2,
                      )}
                      %
                    </Text>
                  )}
                </View>

                <View
                  style={
                    styles.participantRight
                  }
                >
                  <Text
                    style={
                      styles.participantAmount
                    }
                  >
                    ₹
                    {Number(
                      calculated?.amount ||
                        0,
                    ).toFixed(
                      2,
                    )}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      handleRemoveParticipant(
                        participant.userId,
                      )
                    }
                  >
                    <Text
                      style={
                        styles.removeText
                      }
                    >
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          },
        )}

        {/* ==================================================
            SUMMARY
        ================================================== */}

        {participants.length >
          0 && (
          <View
            style={
              styles.summaryCard
            }
          >
            <Text
              style={
                styles.summaryTitle
              }
            >
              Split Summary
            </Text>

            <View
              style={
                styles.amountRow
              }
            >
              <Text
                style={
                  styles.amountLabel
                }
              >
                Final Bill
              </Text>

              <Text
                style={
                  styles.amountValue
                }
              >
                ₹
                {finalAmount.toFixed(
                  2,
                )}
              </Text>
            </View>

            <View
              style={
                styles.amountRow
              }
            >
              <Text
                style={
                  styles.amountLabel
                }
              >
                Split Total
              </Text>

              <Text
                style={
                  styles.amountValue
                }
              >
                ₹
                {totalSplitAmount.toFixed(
                  2,
                )}
              </Text>
            </View>

            {splitType ===
              'percentage' && (
              <View
                style={
                  styles.amountRow
                }
              >
                <Text
                  style={
                    styles.amountLabel
                  }
                >
                  Percentage
                </Text>

                <Text
                  style={[
                    styles.amountValue,
                    Math.abs(
                      totalPercentage -
                        100,
                    ) > 0.01 &&
                      styles.invalidValue,
                  ]}
                >
                  {totalPercentage.toFixed(
                    2,
                  )}
                  %
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ==================================================
            SAVE
        ================================================== */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            loading &&
              styles.disabledButton,
          ]}
          activeOpacity={0.7}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color={
                colors.primary
              }
            />
          ) : (
            <Text
              style={
                styles.saveButtonText
              }
            >
              {isEditing
                ? 'Update Bill'
                : 'Save Bill'}
            </Text>
          )}
        </TouchableOpacity>

        {/* ==================================================
            DELETE
        ================================================== */}

        {isEditing && (
          <TouchableOpacity
            style={
              styles.deleteButton
            }
            activeOpacity={0.7}
            onPress={
              handleDelete
            }
            disabled={loading}
          >
            <Text
              style={
                styles.deleteButtonText
              }
            >
              Delete Bill
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    paddingHorizontal: 15,
  },

  backButton: {
    width: 50,
  },

  backText: {
    color: colors.white,
    fontSize: 28,
  },

  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },

  headerSpace: {
    width: 50,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 15,
    marginBottom: 12,
  },

  input: {
    backgroundColor:
      colors.card,
    color: colors.textDark,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },

  discountCard: {
    backgroundColor:
      colors.card,
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  discountInfo: {
    flex: 1,
  },

  discountTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },

  discountDescription: {
    color: colors.textDark,
    fontSize: 12,
    marginTop: 4,
  },

  discountPercent: {
    color: colors.success,
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 10,
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 12,
  },

  amountLabel: {
    color: colors.white,
    fontSize: 15,
  },

  amountValue: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },

  discountValue: {
    color: colors.success,
    fontSize: 15,
    fontWeight: '700',
  },

  finalLabel: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '800',
  },

  finalAmount: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '800',
  },

  // ==================================================
  // SELECT
  // ==================================================

  selectInput: {
    backgroundColor:
      colors.card,
    borderRadius: 14,
    minHeight: 58,
    paddingHorizontal: 18,
    paddingVertical: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  placeholderText: {
    color: colors.placeholder,
    fontSize: 16,
  },

  selectedText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },

  dropdownArrow: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },

  // ==================================================
  // DROPDOWN
  // ==================================================

  dropdown: {
    backgroundColor:
      colors.card,
    borderRadius: 14,
    marginTop: -6,
    marginBottom: 12,
    overflow: 'hidden',
  },

  dropdownLoader: {
    paddingVertical: 20,
  },

  noUsersText: {
    color: colors.textDark,
    textAlign: 'center',
    padding: 18,
  },

  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor:
      colors.border,
  },

  disabledUserOption: {
    opacity: 0.45,
  },

  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor:
      colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  smallAvatarText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },

  userOptionInfo: {
    flex: 1,
  },

  userOptionName: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '800',
  },

  userOptionEmail: {
    color: colors.textDark,
    fontSize: 11,
    marginTop: 2,
  },

  selectedMark: {
    color: colors.success,
    fontSize: 20,
    fontWeight: '800',
  },

  // ==================================================
  // SPLIT TYPE
  // ==================================================

  splitContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  splitButton: {
    flex: 1,
    backgroundColor:
      colors.card,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 6,
  },

  selectedSplitButton: {
    backgroundColor:
      colors.accent,
  },

  splitButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },

  selectedSplitText: {
    color: colors.primaryDark,
  },

  // ==================================================
  // ADD PARTICIPANT
  // ==================================================

  addParticipantButton: {
    backgroundColor:
      colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 15,
  },

  addParticipantText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },

  // ==================================================
  // SELECTED PARTICIPANT
  // ==================================================

  selectedParticipantBox: {
    backgroundColor:
      colors.primaryDark,
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      colors.border,
    padding: 14,
    marginBottom: 15,
  },

  selectedParticipantLabel: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },

  selectedParticipantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  selectedParticipantName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },

  percentageLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7,
  },

  confirmParticipantButton: {
    backgroundColor:
      colors.accent,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 2,
  },

  confirmParticipantText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },

  // ==================================================
  // PARTICIPANT CARD
  // ==================================================

  participantCard: {
    backgroundColor:
      colors.card,
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor:
      colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  avatarText: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '800',
  },

  participantInfo: {
    flex: 1,
  },

  participantName: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '800',
  },

  participantPercentage: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },

  participantRight: {
    alignItems: 'flex-end',
  },

  participantAmount: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
  },

  removeText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: '700',
  },

  // ==================================================
  // SUMMARY
  // ==================================================

  summaryCard: {
    backgroundColor:
      colors.primaryDark,
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      colors.border,
    padding: 16,
    marginTop: 5,
    marginBottom: 15,
  },

  summaryTitle: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },

  invalidValue: {
    color: colors.error,
  },

  // ==================================================
  // SAVE
  // ==================================================

  saveButton: {
    backgroundColor:
      colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
  },

  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },

  disabledButton: {
    opacity: 0.6,
  },

  // ==================================================
  // DELETE
  // ==================================================

  deleteButton: {
    backgroundColor:
      colors.error,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },

  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default ManageBillScreen;