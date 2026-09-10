import React, {useCallback} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {
  fetchRecentExpenses,
  clearExpenseError,
} from '../../store/slices/expenseSlice';

import ExpenseCard from '../../components/Expense/ExpenseCard';

import colors from '../../constants/colors';

const RecentExpensesScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {
    recentExpenses,
    loading,
    error,
  } = useSelector(state => state.expenses);

  const loadExpenses = useCallback(() => {
    dispatch(fetchRecentExpenses());
  }, [dispatch]);

  React.useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const totalAmount = recentExpenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0,
  );

  const handleExpensePress = expense => {
    navigation.navigate('ManageExpense', {
      expense,
    });
  };

  const handleRetry = () => {
    dispatch(clearExpenseError());
    loadExpenses();
  };

  const renderExpense = ({item}) => {
    return (
      <ExpenseCard
        expense={{
          ...item,
          date: formatDate(item.date),
        }}
        onPress={() => handleExpensePress(item)}
      />
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color={colors.accent}
          />

          <Text style={styles.loadingText}>
            Loading recent expenses...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>
            Something went wrong
          </Text>

          <Text style={styles.errorMessage}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>
          💸
        </Text>

        <Text style={styles.emptyTitle}>
          No Recent Expenses
        </Text>

        <Text style={styles.emptyMessage}>
          Your expenses from the last 7 days
          will appear here.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Recent Expenses
          </Text>

          <Text style={styles.subtitle}>
            Last 7 days
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('ManageExpense')
          }
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      {/* TOTAL CARD */}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          Total Spent
        </Text>

        <Text style={styles.totalAmount}>
          ₹{totalAmount.toFixed(2)}
        </Text>
      </View>

      {/* ERROR */}

      {error && recentExpenses.length > 0 && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            {error}
          </Text>

          <TouchableOpacity
            onPress={handleRetry}
          >
            <Text style={styles.retryBannerText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* EXPENSE LIST */}

      <FlatList
        data={recentExpenses}
        keyExtractor={item =>
          item._id || item.id
        }
        renderItem={renderExpense}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          recentExpenses.length === 0
            ? styles.emptyList
            : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={
              loading && recentExpenses.length > 0
            }
            onRefresh={loadExpenses}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const formatDate = date => {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString();
};

export default RecentExpensesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 15,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#D1C4E9',
    fontSize: 13,
    marginTop: 4,
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 32,
  },

  totalCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },

  totalLabel: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '600',
  },

  totalAmount: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },

  list: {
    paddingBottom: 25,
  },

  emptyList: {
    flexGrow: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  loadingText: {
    color: colors.white,
    fontSize: 14,
    marginTop: 12,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 12,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: 'bold',
  },

  emptyMessage: {
    color: '#D1C4E9',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 20,
  },

  errorTitle: {
    color: colors.error,
    fontSize: 18,
    fontWeight: 'bold',
  },

  errorMessage: {
    color: '#D1C4E9',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 7,
  },

  retryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 18,
  },

  retryText: {
    color: colors.primary,
    fontWeight: 'bold',
  },

  errorBanner: {
    backgroundColor: '#4A2630',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  errorBannerText: {
    color: colors.error,
    fontSize: 12,
    flex: 1,
    marginRight: 10,
  },

  retryBannerText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: 'bold',
  },
});