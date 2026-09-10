import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import colors from '../../constants/colors';

const ExpenseCard = ({ expense, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Text style={styles.description} numberOfLines={1}>
          {expense.description}
        </Text>

        <Text style={styles.date}>
          {expense.date}
        </Text>
      </View>

      <Text style={styles.amount}>
        ₹{Number(expense.amount).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  left: {
    flex: 1,
    marginRight: 10,
  },

  description: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '700',
  },

  date: {
    color: '#666',
    fontSize: 13,
    marginTop: 5,
  },

  amount: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default ExpenseCard;