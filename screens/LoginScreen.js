import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Button from '../components/Button';
import { WalletContext } from '../contexts/WalletContext';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(WalletContext);

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      console.log('Login successful:', response.data);
      await login(response.data.token);
      navigation.navigate('Home', { user: response.data.user });
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert('Login Failed', error.response?.data?.message || 'Failed to log in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Log In" onPress={handleLogin} />
      <Text style={styles.loginLink} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginLink: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
  },
  walletSelection: {
    marginBottom: 20,
  },
  walletLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  walletOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  walletType: {
    fontSize: 14,
  },
  loginLink: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
  },
});