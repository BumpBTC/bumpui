import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import QRCode from 'react-native-qrcode-svg';

const GoogleAuthSetupScreen = ({ navigation }) => {
  const [authCode, setAuthCode] = useState('');
  const { colors } = useTheme();
  const { wallets, updateSecurityLevel, securityLevel } = useContext(WalletContext);

  const handleSetup = async () => {
    // TODO: Verify the entered code
    alert('Google Authenticator set up successfully');
    if (securityLevel < 1) {
        await updateSecurityLevel(1);
        navigation.goBack();
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Authenticator Setup</Text>
      <Text style={styles.description}>
        Scan the QR code below with your Google Authenticator app on your phone.
      </Text>

      {/* Placeholder for QR code image */}
      <QRCode
        // value={invoice}
        size={200}
        color={colors.text}
        backgroundColor={colors.background}
      />

<Text style={styles.description}>Or enter this code:</Text>
      <Text style={styles.code}>ABCD EFGH IJKL MNOP</Text>

      <Input
        placeholder="Enter the 6-digit code from your Auth App"
        value={authCode}
        onChangeText={setAuthCode}
        keyboardType="numeric"
      />

      <Button title="Verify and Setup" onPress={handleSetup} />
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
    marginBottom: 20,
  },
  description: {
    marginBottom: 20,
    textAlign: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  code: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default GoogleAuthSetupScreen;

// TODO: Generate actual QR code and secret key
// TODO: Implement verification of entered code
// TODO: Handle success/error states