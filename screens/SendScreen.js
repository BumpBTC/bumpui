import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { WalletContext } from '../contexts/WalletContext';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const SendScreen = ({ navigation }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('bitcoin');
  const { clientKeyShare } = useContext(WalletContext);
  const { colors } = useTheme();
  const { sendTransaction } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!address || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const response = await sendTransaction(paymentType, address, parseFloat(amount));
      setIsLoading(false);
      navigation.navigate('TransactionStatus', { status: 'success', txid: response.txid });
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to send transaction');
    }
  };

  return (
    <LinearGradient colors={[colors.background, colors.primary + '22']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="fadeInUp" delay={300}>
          <Input
            label={paymentType === 'bitcoin' ? "Recipient Address" : "Lightning Invoice"}
            value={address}
            onChangeText={setAddress}
            placeholder={paymentType === 'bitcoin' ? "Enter Bitcoin address" : "Enter Lightning invoice"}
          />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" delay={400}>
          <Input
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" delay={500} style={styles.buttonContainer}>
          <Button
            title="Bitcoin"
            onPress={() => setPaymentType('bitcoin')}
            style={[styles.typeButton, paymentType === 'bitcoin' && styles.activeButton]}
            textStyle={paymentType === 'bitcoin' && styles.activeButtonText}
          />
          <Button
            title="Lightning"
            onPress={() => setPaymentType('lightning')}
            style={[styles.typeButton, paymentType === 'lightning' && styles.activeButton]}
            textStyle={paymentType === 'lightning' && styles.activeButtonText}
          />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" delay={600}>
          <Button title="Send" onPress={handleSend} loading={isLoading} />
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    width: '48%',
  },
  activeButton: {
    opacity: 0.8,
  },
  activeButtonText: {
    fontWeight: 'bold',
  },
});

export default SendScreen;