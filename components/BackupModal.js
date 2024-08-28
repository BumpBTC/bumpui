import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import Button from './Button';
import { useTheme } from '../contexts/ThemeContext';
import * as MailComposer from 'expo-mail-composer';

const BackupModal = ({ visible, walletData, onComplete }) => {
  const [email, setEmail] = useState('');
  const { colors } = useTheme();

  const handleEmailBackup = async () => {
    if (email) {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        try {
          const result = await MailComposer.composeAsync({
            recipients: [email],
            subject: 'Your Wallet Backup',
            body: JSON.stringify(walletData, null, 2),
          });

          if (result.status === 'sent') {
            Alert.alert('Success', 'Backup sent successfully');
            onComplete(true, email);
          } else {
            Alert.alert('Error', 'Failed to send backup email');
            onComplete(false, email);
          }
        } catch (error) {
          console.error('Email composition error:', error);
          Alert.alert('Error', 'Failed to compose backup email');
          onComplete(false, email);
        }
      } else {
        Alert.alert('Error', 'Email is not available on this device');
        onComplete(false, email);
      }
    } else {
      // If no email is provided, just complete without backup
      onComplete(false, null);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Backup Your Wallet</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          Enter an email address to backup your wallet data (recommended):
        </Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="Enter your email (optional)"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Button title="Complete Setup" onPress={handleEmailBackup} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  skipButton: {
    marginTop: 10,
    backgroundColor: 'gray',
  },
});

export default BackupModal;