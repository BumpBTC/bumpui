import React, { useState, useContext } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, Alert } from 'react-native';
import Button from './Button';
import api from '../services/api';
import { saveToken } from '../services/auth';
import { WalletContext } from '../contexts/WalletContext';

const LoginModal = ({ visible, onClose, navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { fetchWalletData } = useContext(WalletContext);

  const handleLogin = async () => {
    try {
      setError('');
      const response = await api.post('/auth/login', { identifier, password });
      const { token } = response.data;
      await saveToken(token);
      await fetchWalletData();
      onClose();
      navigation.navigate('Main', { screen: 'Home' });
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Login failed. Please try again.');
      Alert.alert('Login Error', error.response?.data?.error || 'Login failed. Please try again.');
    }
  };
  
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username or Email"
            value={identifier}
            onChangeText={setIdentifier}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button title="Login" onPress={handleLogin} />
          <Button title="Cancel" onPress={onClose} style={styles.cancelButton} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    marginTop: 10,
  },
});

export default LoginModal;