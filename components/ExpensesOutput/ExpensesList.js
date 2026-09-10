import { FlatList } from "react-native";
import ExpensesItem from "./ExpenseItem";

function renderExpenseItem(itemData) {
  return <ExpensesItem {...itemData.item} />;
}
function ExpensesList({ expenses }) {
  return (
    <FlatList
      data={expenses}
      renderItem={renderExpenseItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default ExpensesList;
