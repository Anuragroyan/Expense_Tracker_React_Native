import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import colors from '../../constants/colors';

const ParticipantRow = ({ participant }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>
          {participant.name}
        </Text>

        <Text style={styles.percentage}>
          {Number(participant.percentage).toFixed(2)}%
        </Text>
      </View>

      <Text style={styles.amount}>
        ₹{Number(participant.amount).toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '700',
  },

  percentage: {
    color: '#666',
    fontSize: 12,
    marginTop: 3,
  },

  amount: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
});

export default ParticipantRow;