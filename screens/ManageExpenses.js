import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useContext, useLayoutEffect, useState } from "react";

import IconButton from "../components/UI/IconButton";
import { GlobalColors } from "../constants/color";
import { ExpensesContext } from "../store/expenses-context";

function ManageExpenses({ route, navigation }) {
  const expensesCtx = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [enteredDescription, setEnteredDescription] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  function deleteExpenseHandler() {
    expensesCtx.deleteExpense(editedExpenseId);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  function confirmHandler() {
    const amount = parseFloat(enteredAmount);

    if (
      !amount ||
      amount <= 0 ||
      !enteredDate ||
      !enteredDescription.trim()
    ) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid amount, date and description."
      );
      return;
    }

    const expenseData = {
      description: enteredDescription.trim(),
      amount: amount,
      date: new Date(enteredDate),
    };

    if (isEditing) {
      expensesCtx.updateExpense(editedExpenseId, expenseData);
    } else {
      expensesCtx.addExpense(expenseData);
    }

    navigation.goBack();
  }

  return (
    <View style={styles.container}>

      {/* Amount and Date */}
      <View style={styles.row}>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>

          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={enteredAmount}
            onChangeText={setEnteredAmount}
            placeholder="0.00"
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date</Text>

          <TextInput
            style={styles.input}
            value={enteredDate}
            onChangeText={setEnteredDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#777"
            maxLength={10}
          />
        </View>

      </View>

      {/* Description */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          multiline
          value={enteredDescription}
          onChangeText={setEnteredDescription}
          placeholder="Enter description"
          placeholderTextColor="#777"
          textAlignVertical="top"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>

        <Text
          style={styles.cancelButton}
          onPress={cancelHandler}
        >
          Cancel
        </Text>

        <Text
          style={styles.addButton}
          onPress={confirmHandler}
        >
          {isEditing ? "Update" : "Add"}
        </Text>

      </View>

      {/* Delete */}
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalColors.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}

    </View>
  );
}

export default ManageExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalColors.colors.primary800,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  inputContainer: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 24,
  },

  label: {
    fontSize: 20,
    color: GlobalColors.colors.primary100,
    marginBottom: 8,
  },

  input: {
    backgroundColor: GlobalColors.colors.primary100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 18,
    color: "#222",
    height: 55,
  },

  descriptionInput: {
    height: 150,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  cancelButton: {
    fontSize: 18,
    color: GlobalColors.colors.accent500,
    paddingHorizontal: 25,
    paddingVertical: 12,
  },

  addButton: {
    fontSize: 18,
    color: GlobalColors.colors.accent500,
    backgroundColor: GlobalColors.colors.primary500,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalColors.colors.primary200,
    alignItems: "center",
  },
});