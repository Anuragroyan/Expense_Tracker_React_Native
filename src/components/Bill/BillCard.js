import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import colors from '../../constants/colors';

const BillCard = ({ bill, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Text style={styles.description} numberOfLines={1}>
          {bill.description}
        </Text>

        <Text style={styles.info}>
          Paid by {bill.paidBy?.name || 'Unknown'}
        </Text>

        <Text style={styles.info}>
          {bill.participants?.length || 0} participants
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.amount}>
          ₹{Number(bill.finalAmount).toFixed(2)}
        </Text>

        <Text style={styles.splitType}>
          {bill.splitType === 'percentage'
            ? 'Percentage'
            : 'Equal Split'}
        </Text>
      </View>
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
    marginBottom: 6,
  },

  info: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },

  right: {
    alignItems: 'flex-end',
  },

  amount: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },

  splitType: {
    color: '#666',
    fontSize: 11,
    marginTop: 5,
  },
});

export default BillCard;