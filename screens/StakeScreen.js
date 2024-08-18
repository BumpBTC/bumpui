import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import Input from '../components/Input';
import Button from '../components/Button';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';

const StakeScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const { balance } = useContext(WalletContext);
  const { colors } = useTheme();
  const { stakeTokens } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);

  // const handleStake = async () => {
  //   try {
  //     const response = await api.post('/stake/stake', { amount });
  //     Alert.alert(
  //       'Staking Successful',
  //       `You have staked ${amount} BTC successfully.`,
  //       [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
  //     );
  //   } catch (error) {
  //     Alert.alert('Error', error.response?.data?.error || 'Failed to stake');
  //   }
  // };

  const handleStake = useCallback(async () => {
    if (!amount || !duration) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await stakeTokens(parseFloat(amount), parseInt(duration));
      Alert.alert('Success', 'Tokens staked successfully');
      setAmount('');
      setDuration('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to stake tokens');
    } finally {
      setIsLoading(false);
    }
  }, [amount, duration, stakeTokens]);

  const estimatedReward = (parseFloat(amount || 0) * 0.05).toFixed(8);

  return (
    <LinearGradient colors={[colors.background, colors.primary + '22']} style={styles.container}>
    <Animatable.View animation="fadeIn" style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Stake Your Tokens</Text>
      <Text style={[styles.description, { color: colors.text }]}>
        Earn rewards by staking your Bitcoin. The minimum staking period is 30 days.
      </Text>
      <Text style={[styles.balanceText, { color: colors.text }]}>Available Balance: {balance} BTC</Text>
      <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount to stake"
          keyboardType="numeric"
        />
        <Input
          label="Duration (days)"
          value={duration}
          onChangeText={setDuration}
          placeholder="Enter staking duration"
          keyboardType="numeric"
        />
        <Button 
          title="Stake Tokens" 
          onPress={handleStake} 
          loading={isLoading}
          style={styles.button}
        />
      <Text style={[styles.estimatedRewards, { color: colors.text }]}>
        Estimated Annual Reward: {estimatedReward} BTC
      </Text>
      <Button title="Stake" onPress={handleStake} />
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  estimatedRewards: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default React.memo(StakeScreen);