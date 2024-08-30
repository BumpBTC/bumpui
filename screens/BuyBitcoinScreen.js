import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import Button from '../components/Button';
import axios from 'axios';

const BuyBitcoinScreen = () => {
  const { colors } = useTheme();
  const { exchangeRates } = useContext(WalletContext);
  const [amount, setAmount] = useState('');
  const [isBtc, setIsBtc] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://api.moonpay.com/v3/currencies/btc/buy_quote', {
        params: {
          apiKey: 'YOUR_MOONPAY_API_KEY',
          baseCurrencyAmount: isBtc ? (parseFloat(amount) / exchangeRates.bitcoin.usd).toFixed(2) : amount,
          baseCurrencyCode: 'usd',
          fixed: true
        }
      });

      const { quoteCurrencyAmount, feeAmount, extraFeeAmount, networkFeeAmount, totalAmount } = response.data;

      Alert.alert(
        'Buy Bitcoin',
        `You will receive ${quoteCurrencyAmount} BTC for ${totalAmount} USD (including fees)`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Confirm', onPress: () => initiateTransaction(totalAmount) }
        ]
      );
    } catch (error) {
      console.error('Error fetching MoonPay quote:', error);
      Alert.alert('Error', 'Failed to get quote from MoonPay');
    } finally {
      setIsLoading(false);
    }
  };

  const initiateTransaction = async (totalAmount) => {
    // Here you would typically redirect to MoonPay's widget or handle the transaction
    // For this example, we'll just show an alert
    Alert.alert('Transaction Initiated', `You're being redirected to complete the purchase of ${amount} ${isBtc ? 'BTC' : 'USD'} worth of Bitcoin.`);
  };

  const toggleCurrency = () => {
    setIsBtc(!isBtc);
    setAmount('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Buy Bitcoin</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder={`Enter amount in ${isBtc ? 'BTC' : 'USD'}`}
          placeholderTextColor={colors.placeholder}
        />
        <Button title={isBtc ? 'BTC' : 'USD'} onPress={toggleCurrency} style={styles.currencyToggle} />
      </View>
      {!isBtc && (
        <Text style={[styles.conversionText, { color: colors.text }]}>
          ≈ {amount ? (parseFloat(amount) / exchangeRates.bitcoin.usd).toFixed(8) : '0'} BTC
        </Text>
      )}
      <Button title="Buy Bitcoin" onPress={handleBuy} loading={isLoading} style={styles.buyButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  currencyToggle: {
    width: 60,
  },
  conversionText: {
    marginBottom: 20,
  },
  buyButton: {
    width: '100%',
  },
});

export default BuyBitcoinScreen;