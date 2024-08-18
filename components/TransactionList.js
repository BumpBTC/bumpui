import React, { memo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import * as Animatable from 'react-native-animatable';

const TransactionItem = memo(({ transaction }) => {
  const { colors } = useTheme();
  
  return (
    <Animatable.View 
      animation="fadeIn" 
      duration={500} 
      style={[styles.transactionItem, { backgroundColor: colors.card }]}
    >
      <Text style={[styles.transactionAmount, { color: colors.text }]}>
        {transaction.amount} {transaction.walletType.toUpperCase()}
      </Text>
      <Text style={[styles.transactionAddress, { color: colors.textSecondary }]}>
        {transaction.address}
      </Text>
      <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
        {new Date(transaction.timestamp).toLocaleString()}
      </Text>
    </Animatable.View>
  );
});

const TransactionList = ({ transactions = [] }) => {
  const { colors } = useTheme();

  const renderItem = ({ item }) => <TransactionItem transaction={item} />;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAddress: {
    fontSize: 14,
  },
  transactionDate: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default memo(TransactionList);