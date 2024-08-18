import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Switch, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import { saveToken } from '../services/auth';
import { useTheme } from '../contexts/ThemeContext';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bitcoinWallet, setBitcoinWallet] = useState(false);
  const [lightningWallet, setLightningWallet] = useState(false);
  const { colors } = useTheme();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!bitcoinWallet && !lightningWallet) {
      Alert.alert('Error', 'Please select at least one wallet type');
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        walletTypes: {
          bitcoin: bitcoinWallet,
          lightning: lightningWallet
        }
      });

      const { token, user } = response.data;
      await saveToken(token);
      navigation.navigate('Backup', { walletData: user.wallets });
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      Alert.alert('Signup Failed', error.response?.data?.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Input
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Enter a username"
        leftIcon={<Ionicons name="person-outline" size={24} color={colors.text} />}
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        leftIcon={<Ionicons name="mail-outline" size={24} color={colors.text} />}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Create a password"
        leftIcon={<Ionicons name="lock-closed-outline" size={24} color={colors.text} />}
      />
      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm your password"
        leftIcon={<Ionicons name="lock-closed-outline" size={24} color={colors.text} />}
      />
      <View style={styles.walletSelection}>
        <Text style={[styles.walletLabel, { color: colors.text }]}>Select Wallet Types:</Text>
        <View style={styles.walletOption}>
          <Text style={[styles.walletType, { color: colors.text }]}>Bitcoin Wallet (Native SegWit)</Text>
          <Switch
            value={bitcoinWallet}
            onValueChange={setBitcoinWallet}
            trackColor={{ false: colors.accent, true: colors.primary }}
          />
        </View>
        <View style={styles.walletOption}>
          <Text style={[styles.walletType, { color: colors.text }]}>Lightning Wallet</Text>
          <Switch
            value={lightningWallet}
            onValueChange={setLightningWallet}
            trackColor={{ false: colors.accent, true: colors.primary }}
          />
        </View>
      </View>
      <Button title="Create Account" onPress={handleSignup} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  walletSelection: {
    marginBottom: 20,
  },
  walletLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  walletOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  walletType: {
    fontSize: 14,
  },
});

export default SignupScreen;