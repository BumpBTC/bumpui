import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import { Input, Button } from 'react-native-elements';

const PhoneBackupScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { wallets, updateSecurityLevel, securityLevel } = useContext(WalletContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement sending verification code
    setShowVerification(true);
  };

  const handleVerify = async () => {
    // TODO: Implement verification logic
    Alert.alert('Success', 'Phone number verified successfully');
    if (securityLevel < 1) {
        await updateSecurityLevel(1);
        navigation.goBack();
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Number Backup</Text>
      <Input
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Submit" onPress={handleSubmit} />

      {showVerification && (
        <View>
          <Input
            placeholder="Enter verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
          />
          <Button title="Verify" onPress={handleVerify} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default PhoneBackupScreen;

// TODO: Implement phone number validation
// TODO: Implement actual SMS sending functionality
// TODO: Handle success/error states