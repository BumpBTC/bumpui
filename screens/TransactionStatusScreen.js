import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

const TransactionStatusScreen = ({ route }) => {
  const { colors } = useTheme();
  const { status, amount, recipient, txid } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animatable.View animation="zoomIn" duration={1000} style={styles.iconContainer}>
        <Icon 
          name={status === 'success' ? 'check-circle' : status === 'pending' ? 'clock-outline' : 'alert-circle'}
          size={100}
          color={status === 'success' ? 'green' : status === 'pending' ? 'orange' : 'red'}
        />
      </Animatable.View>
      <Text style={[styles.statusText, { color: colors.text }]}>
        {status === 'success' ? 'Transaction Successful' : status === 'pending' ? 'Transaction Pending' : 'Transaction Failed'}
      </Text>
      <Text style={[styles.detailText, { color: colors.text }]}>Amount: {amount}</Text>
      <Text style={[styles.detailText, { color: colors.text }]}>Recipient: {recipient}</Text>
      <Text style={[styles.detailText, { color: colors.text }]}>Transaction ID: {txid}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default TransactionStatusScreen;