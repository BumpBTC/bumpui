import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import Button from '../components/Button';

const HardwareKeyBackupScreen = ({ navigation }) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const { colors } = useTheme();
  const { wallets, updateSecurityLevel, securityLevel } = useContext(WalletContext);

  const handleBackup = () => {
    setIsBackingUp(true);
    // TODO: Implement actual backup process
    setTimeout(() => {
      setIsBackingUp(false);
      alert('Backup to hardware key successful');
      if (securityLevel < 1) {
        updateSecurityLevel(1);
        navigation.goBack();
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hardware Key Backup</Text>
      <Text style={styles.description}>
        Backup all your sensitive wallet information to a hardware key for maximum security. Your encrypted credentials are stored on your mobile phone device. Recover or transfer your wallets easily. Your keys, your coins.
      </Text>

      <Button
        title={isBackingUp ? "Backing up..." : "Backup to Hardware Key"}
        onPress={handleBackup}
        loading={isBackingUp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  description: {
    marginBottom: 40,
    paddingHorizontal: 40,
    textAlign: 'center',
  },
});

export default HardwareKeyBackupScreen;

// TODO: Implement actual hardware key backup process
// TODO: Handle different types of hardware keys
// TODO: Implement error handling for failed backups