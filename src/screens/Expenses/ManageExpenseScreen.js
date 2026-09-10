import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {useDispatch, useSelector} from 'react-redux';

import {
  addExpense,
  editExpense,
  removeExpense,
} from '../../store/slices/expenseSlice';

import colors from '../../constants/colors';

const ManageExpenseScreen = ({route, navigation}) => {
  const dispatch = useDispatch();

  const {loading} = useSelector(
    state => state.expenses,
  );

  // ==================================================
  // EXISTING EXPENSE
  // ==================================================

  const existingExpense =
    route.params?.expense;

  const isEditing =
    Boolean(existingExpense);

  // ==================================================
  // DESCRIPTION
  // ==================================================

  const [description, setDescription] =
    useState(
      existingExpense?.description || '',
    );

  // ==================================================
  // AMOUNT
  // ==================================================

  const [amount, setAmount] =
    useState(
      existingExpense?.amount !== undefined
        ? String(existingExpense.amount)
        : '',
    );

  // ==================================================
  // DATE
  // ==================================================

  const [date, setDate] = useState(() => {
    if (existingExpense?.date) {
      const parsedDate = new Date(
        existingExpense.date,
      );

      if (
        !Number.isNaN(
          parsedDate.getTime(),
        )
      ) {
        return parsedDate;
      }
    }

    return new Date();
  });

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  // ==================================================
  // DISPLAY DATE
  // ==================================================

  const formatDisplayDate = value => {
    if (!value) {
      return '';
    }

    return value.toLocaleDateString();
  };

  // ==================================================
  // API DATE
  // ==================================================

  const formatDateForApi = value => {
    if (!value) {
      return '';
    }

    const year =
      value.getFullYear();

    const month = String(
      value.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      value.getDate(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // ==================================================
  // DATE CHANGE
  // ==================================================

  const handleDateChange = (
    event,
    selectedDate,
  ) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // ==================================================
  // SAVE EXPENSE
  // ==================================================

  const handleSave = async () => {
    const cleanDescription =
      description.trim();

    const numericAmount =
      Number(amount);

    // ------------------------------------------------
    // DESCRIPTION VALIDATION
    // ------------------------------------------------

    if (!cleanDescription) {
      Alert.alert(
        'Validation',
        'Please enter expense description.',
      );

      return;
    }

    // ------------------------------------------------
    // AMOUNT VALIDATION
    // ------------------------------------------------

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      Alert.alert(
        'Validation',
        'Please enter a valid amount.',
      );

      return;
    }

    // ------------------------------------------------
    // DATE VALIDATION
    // ------------------------------------------------

    if (!date) {
      Alert.alert(
        'Validation',
        'Please select expense date.',
      );

      return;
    }

    // ------------------------------------------------
    // EXPENSE DATA
    // ------------------------------------------------

    const expenseData = {
      description:
        cleanDescription,

      amount:
        numericAmount,

      date:
        formatDateForApi(date),
    };

    let result;

    // ------------------------------------------------
    // EDIT EXPENSE
    // ------------------------------------------------

    if (isEditing) {
      result =
        await dispatch(
          editExpense({
            id:
              existingExpense._id,

            expenseData,
          }),
        );
    }

    // ------------------------------------------------
    // CREATE EXPENSE
    // ------------------------------------------------

    else {
      result =
        await dispatch(
          addExpense(
            expenseData,
          ),
        );
    }

    // ------------------------------------------------
    // SUCCESS
    // ------------------------------------------------

    if (
      addExpense.fulfilled.match(
        result,
      )
    ) {
      Alert.alert(
        'Success',
        'Expense created successfully.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.goBack(),
          },
        ],
      );

      return;
    }

    if (
      editExpense.fulfilled.match(
        result,
      )
    ) {
      Alert.alert(
        'Success',
        'Expense updated successfully.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.goBack(),
          },
        ],
      );

      return;
    }
  };

  // ==================================================
  // DELETE EXPENSE
  // ==================================================

  const handleDelete = () => {
    if (
      !existingExpense?._id
    ) {
      return;
    }

    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            const result =
              await dispatch(
                removeExpense(
                  existingExpense._id,
                ),
              );

            if (
              removeExpense.fulfilled.match(
                result,
              )
            ) {
              Alert.alert(
                'Success',
                'Expense deleted successfully.',
                [
                  {
                    text: 'OK',
                    onPress: () =>
                      navigation.goBack(),
                  },
                ],
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
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          💰{' '}
          {isEditing
            ? 'Edit Expense'
            : 'Add Expense'}
        </Text>

        <View style={styles.headerSpace} />

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
      >

        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <Text style={styles.label}>
          Expense Description
        </Text>

        <TextInput
          value={description}
          onChangeText={
            setDescription
          }
          placeholder="Food, Travel, Shopping..."
          placeholderTextColor={
            colors.placeholder
          }
          style={styles.input}
          autoCapitalize="sentences"
        />

        {/* ==================================================
            AMOUNT
        ================================================== */}

        <Text style={styles.label}>
          Amount
        </Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="₹ 0.00"
          placeholderTextColor={
            colors.placeholder
          }
          keyboardType="decimal-pad"
          style={styles.input}
        />

        {/* ==================================================
            DATE
        ================================================== */}

        <Text style={styles.label}>
          Date
        </Text>

        <TouchableOpacity
          style={styles.dateInput}
          onPress={() =>
            setShowDatePicker(true)
          }
        >
          <Text style={styles.dateText}>
            {formatDisplayDate(date)}
          </Text>

          <Text style={styles.calendarIcon}>
            📅
          </Text>
        </TouchableOpacity>

        {/* ==================================================
            DATE PICKER
        ================================================== */}

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={
              Platform.OS === 'ios'
                ? 'spinner'
                : 'default'
            }
            onChange={
              handleDateChange
            }
          />
        )}

        {/* ==================================================
            SUMMARY
        ================================================== */}

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
            💰 Expense Summary
          </Text>

          {/* DESCRIPTION */}

          <View
            style={
              styles.summaryRow
            }
          >
            <Text
              style={
                styles.summaryLabel
              }
            >
              Description
            </Text>

            <Text
              style={
                styles.summaryValue
              }
              numberOfLines={1}
            >
              {description.trim() ||
                '—'}
            </Text>
          </View>

          {/* AMOUNT */}

          <View
            style={
              styles.summaryRow
            }
          >
            <Text
              style={
                styles.summaryLabel
              }
            >
              Amount
            </Text>

            <Text
              style={
                styles.summaryAmount
              }
            >
              ₹
              {Number(
                amount || 0,
              ).toFixed(2)}
            </Text>
          </View>

          {/* DATE */}

          <View
            style={
              styles.summaryRow
            }
          >
            <Text
              style={
                styles.summaryLabel
              }
            >
              Date
            </Text>

            <Text
              style={
                styles.summaryValue
              }
            >
              {formatDisplayDate(
                date,
              )}
            </Text>
          </View>

        </View>

        {/* ==================================================
            SAVE BUTTON
        ================================================== */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            loading &&
              styles.disabledButton,
          ]}
          onPress={
            handleSave
          }
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
                ? 'Update Expense'
                : 'Save Expense'}
            </Text>

          )}

        </TouchableOpacity>

        {/* ==================================================
            DELETE BUTTON
        ================================================== */}

        {isEditing && (

          <TouchableOpacity
            style={
              styles.deleteButton
            }
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
              Delete Expense
            </Text>

          </TouchableOpacity>

        )}

      </ScrollView>

    </View>
  );
};

// ======================================================
// STYLES — OLD COMPACT VIEW
// ======================================================

const styles = StyleSheet.create({

  // ====================================================
  // CONTAINER
  // ====================================================

  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  // ====================================================
  // HEADER
  // ====================================================

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
    fontWeight: '400',
  },

  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },

  headerSpace: {
    width: 50,
  },

  // ====================================================
  // CONTENT
  // ====================================================

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // ====================================================
  // LABEL
  // ====================================================

  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  // ====================================================
  // INPUT
  // ====================================================

  input: {
    backgroundColor:
      colors.card,
    color: colors.textDark,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
  },

  // ====================================================
  // DATE
  // ====================================================

  dateInput: {
    backgroundColor:
      colors.card,
    borderRadius: 12,
    minHeight: 55,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  dateText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },

  calendarIcon: {
    fontSize: 20,
  },

  // ====================================================
  // SUMMARY
  // ====================================================

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
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 12,
  },

  summaryLabel: {
    color: colors.white,
    fontSize: 14,
  },

  summaryValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    maxWidth: '60%',
  },

  summaryAmount: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '800',
  },

  // ====================================================
  // SAVE
  // ====================================================

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

  // ====================================================
  // DELETE
  // ====================================================

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

export default ManageExpenseScreen;