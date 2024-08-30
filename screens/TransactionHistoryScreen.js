import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { WalletContext } from '../contexts/WalletContext';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const { getLightningTransactionHistory } = useContext(WalletContext);
  const { colors } = useTheme();

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      const history = await getLightningTransactionHistory();
      setTransactions(history);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    }
  };

  const renderTransactionItem = ({ item }) => (
    <View style={[styles.transactionItem, { backgroundColor: colors.card }]}>
      <Text style={[styles.transactionText, { color: colors.text }]}>Amount: {item.amount} sats</Text>
      <Text style={[styles.transactionText, { color: colors.text }]}>Type: {item.type}</Text>
      <Text style={[styles.transactionText, { color: colors.text }]}>Status: {item.status}</Text>
      <Text style={[styles.transactionText, { color: colors.text }]}>Date: {new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <LinearGradient colors={[colors.background, colors.primary + '22']} style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactionItem: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  transactionText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TransactionHistoryScreen;
