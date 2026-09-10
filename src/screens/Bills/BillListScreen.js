import React, {useCallback} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {
  fetchBills,
  removeBill,
  clearBillError,
} from '../../store/slices/billSlice';

import BillCard from '../../components/Bill/BillCard';

import colors from '../../constants/colors';

const BillListScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {
    bills,
    loading,
    error,
  } = useSelector(state => state.bills);

  // --------------------------------------------------
  // FETCH BILLS
  // --------------------------------------------------

  const loadBills = useCallback(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'focus',
      () => {
        loadBills();
      },
    );

    return unsubscribe;
  }, [navigation, loadBills]);

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearBillError());
    }
  }, [error, dispatch]);

  // --------------------------------------------------
  // DELETE BILL
  // --------------------------------------------------

  const handleDelete = bill => {
    Alert.alert(
      'Delete Bill',
      `Are you sure you want to delete "${bill.description}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(removeBill(bill._id));
          },
        },
      ],
    );
  };

  // --------------------------------------------------
  // OPEN BILL DETAILS
  // --------------------------------------------------

  const handleBillPress = bill => {
    navigation.navigate('BillDetails', {
      billId: bill._id,
    });
  };

  // --------------------------------------------------
  // ADD BILL
  // --------------------------------------------------

  const handleAddBill = () => {
    navigation.navigate('ManageBill');
  };

  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  const totalAmount = bills.reduce(
    (total, bill) =>
      total + Number(bill.finalAmount ?? bill.totalAmount ?? 0),
    0,
  );

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading && bills.length === 0) {
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
  // RENDER BILL
  // --------------------------------------------------

  const renderBill = ({item}) => {
    return (
      <BillCard
        bill={item}
        onPress={() => handleBillPress(item)}
        onDelete={() => handleDelete(item)}
      />
    );
  };

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------

  const renderEmpty = () => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🧾</Text>

        <Text style={styles.emptyTitle}>
          No Bills Yet
        </Text>

        <Text style={styles.emptyText}>
          Create your first bill and split it with your
          friends.
        </Text>

        <TouchableOpacity
          style={styles.emptyButton}
          onPress={handleAddBill}
        >
          <Text style={styles.emptyButtonText}>
            Add Bill
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            🧾 Bills
          </Text>

          <Text style={styles.subtitle}>
            {bills.length} {bills.length === 1 ? 'Bill' : 'Bills'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddBill}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>
            + Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUMMARY */}
      {bills.length > 0 && (
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>
              Total Bills
            </Text>

            <Text style={styles.summaryCount}>
              {bills.length}
            </Text>
          </View>

          <View style={styles.summaryRight}>
            <Text style={styles.summaryLabel}>
              Total Amount
            </Text>

            <Text style={styles.summaryAmount}>
              ₹{totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      {/* BILL LIST */}
      <FlatList
        data={bills}
        keyExtractor={item =>
          item._id?.toString() ||
          item.id?.toString()
        }
        renderItem={renderBill}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          bills.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadBills}
      />

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
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
  },

  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    color: colors.placeholder,
    fontSize: 13,
    marginTop: 4,
  },

  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  addButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },

  summaryCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    color: colors.textDark,
    fontSize: 13,
    marginBottom: 4,
  },

  summaryCount: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
  },

  summaryRight: {
    alignItems: 'flex-end',
  },

  summaryAmount: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 25,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },

  emptyContainer: {
    alignItems: 'center',
  },

  emptyEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },

  emptyText: {
    color: colors.placeholder,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },

  emptyButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
  },

  emptyButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
});

export default BillListScreen;