import React, {useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {
  fetchBillById,
  removeBill,
  clearSelectedBill,
  clearBillError,
} from '../../store/slices/billSlice';

import colors from '../../constants/colors';

const BillDetailsScreen = ({route, navigation}) => {
  const dispatch = useDispatch();

  const {billId, bill} = route.params || {};

  const {
    selectedBill,
    loading,
    error,
  } = useSelector(state => state.bills);

  const currentBill = selectedBill || bill;

  // --------------------------------------------------
  // FETCH BILL
  // --------------------------------------------------

  useEffect(() => {
    if (billId) {
      dispatch(fetchBillById(billId));
    }

    return () => {
      dispatch(clearSelectedBill());
    };
  }, [dispatch, billId]);

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearBillError());
    }
  }, [error, dispatch]);

  // --------------------------------------------------
  // DELETE BILL
  // --------------------------------------------------

  const handleDelete = () => {
    if (!currentBill?._id) {
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
            const result = await dispatch(
              removeBill(currentBill._id),
            );

            if (removeBill.fulfilled.match(result)) {
              navigation.goBack();
            }
          },
        },
      ],
    );
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading && !currentBill) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />
      </View>
    );
  }

  // --------------------------------------------------
  // EMPTY
  // --------------------------------------------------

  if (!currentBill) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>
          Bill not found
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const participants = currentBill.participants || [];

  const totalAmount = Number(
    currentBill.totalAmount || 0,
  );

  const discountAmount = Number(
    currentBill.discountAmount || 0,
  );

  const finalAmount = Number(
    currentBill.finalAmount ?? totalAmount,
  );

  const discountPercent = Number(
    currentBill.discountPercent || 0,
  );

  const splitType =
    currentBill.splitType === 'percentage'
      ? 'Percentage'
      : 'Equal';

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          🧾 Bill Details
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ManageBill', {
              bill: currentBill,
            })
          }
          style={styles.headerButton}
        >
          <Text style={styles.editText}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* DESCRIPTION */}
        <View style={styles.card}>
          <Text style={styles.description}>
            {currentBill.description}
          </Text>

          <Text style={styles.finalAmount}>
            ₹{finalAmount.toFixed(2)}
          </Text>

          <Text style={styles.splitType}>
            {splitType} Split
          </Text>
        </View>

        {/* BILL SUMMARY */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Bill Summary
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Total Amount
            </Text>

            <Text style={styles.value}>
              ₹{totalAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Discount
            </Text>

            <Text style={styles.discount}>
              {discountPercent > 0
                ? `${discountPercent}% (-₹${discountAmount.toFixed(2)})`
                : 'No discount'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.finalLabel}>
              Final Amount
            </Text>

            <Text style={styles.finalValue}>
              ₹{finalAmount.toFixed(2)}
            </Text>
          </View>

        </View>

        {/* PAID BY */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Paid By
          </Text>

          <View style={styles.personRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(
                  currentBill.paidBy?.name || 'U'
                )
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>

            <View>
              <Text style={styles.personName}>
                {currentBill.paidBy?.name ||
                  'Unknown User'}
              </Text>

              <Text style={styles.paidText}>
                Paid ₹{finalAmount.toFixed(2)}
              </Text>
            </View>
          </View>

        </View>

        {/* PARTICIPANTS */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Split Among
          </Text>

          {participants.length === 0 ? (
            <Text style={styles.noParticipants}>
              No participants
            </Text>
          ) : (
            participants.map((participant, index) => {

              const participantAmount =
                Number(participant.amount || 0);

              const percentage =
                Number(participant.percentage || 0);

              return (
                <View
                  key={
                    participant.userId ||
                    participant._id ||
                    index
                  }
                  style={styles.participantRow}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(participant.name || 'U')
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.participantInfo}>
                    <Text style={styles.personName}>
                      {participant.name ||
                        'Unknown User'}
                    </Text>

                    {currentBill.splitType ===
                      'percentage' && (
                      <Text style={styles.percentage}>
                        {percentage}%
                      </Text>
                    )}
                  </View>

                  <Text style={styles.participantAmount}>
                    ₹{participantAmount.toFixed(2)}
                  </Text>
                </View>
              );
            })
          )}

        </View>

        {/* DELETE */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>
            Delete Bill
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  emptyText: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 20,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },

  headerButton: {
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerButtonText: {
    color: colors.white,
    fontSize: 28,
  },

  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },

  editText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  description: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  finalAmount: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 5,
  },

  splitType: {
    color: colors.textDark,
    fontSize: 14,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  label: {
    color: colors.textDark,
    fontSize: 15,
  },

  value: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '600',
  },

  discount: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 5,
  },

  finalLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  finalValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },

  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '700',
  },

  personName: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '700',
  },

  paidText: {
    color: colors.textDark,
    fontSize: 13,
    marginTop: 3,
  },

  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  participantInfo: {
    flex: 1,
  },

  percentage: {
    color: colors.textDark,
    fontSize: 12,
    marginTop: 2,
  },

  participantAmount: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  noParticipants: {
    color: colors.textDark,
    fontSize: 14,
  },

  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
  },

  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default BillDetailsScreen;