import React, { useState, useContext } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Button } from 'react-native-elements';

const BiometricsSetupScreen = ({ navigation }) => {
    const { colors } = useTheme();
  const [loginBiometrics, setLoginBiometrics] = useState(false);
  const { wallets, updateSecurityLevel, securityLevel } = useContext(WalletContext);
  const [transactionBiometrics, setTransactionBiometrics] = useState(false);

  const handleSetup = async () => {
    // TODO: Implement biometrics setup
    alert('Biometrics set up successfully');
    if (securityLevel < 1) {
        await updateSecurityLevel(1);
        navigation.goBack();
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometrics Setup</Text>
      <Text style={styles.description}>
        Enable biometric authentication for enhanced security:
      </Text>

      <View style={styles.option}>
        <Text>Use biometrics for login</Text>
        <Switch value={loginBiometrics} onValueChange={setLoginBiometrics} />
      </View>

      <View style={styles.option}>
        <Text>Use biometrics for transactions</Text>
        <Switch value={transactionBiometrics} onValueChange={setTransactionBiometrics} />
      </View>

      <Button 
          title="Setup Biometrics" 
          onPress={handleSetup} 
          style={styles.button}
          disabled={securityLevel >= 1}
        />
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
  description: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default BiometricsSetupScreen;

// TODO: Implement actual biometrics setup using device capabilities
// TODO: Handle devices without biometric capabilities
// TODO: Implement error handling for failed setups