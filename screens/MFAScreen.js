import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import Button from '../components/Button';

const MFAScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { wallets, updateSecurityLevel, securityLevel } = useContext(WalletContext);
  const [loginAlert, setLoginAlert] = useState(false);
  const [largeTransactionAlert, setLargeTransactionAlert] = useState(false);

  const handleSubmit = async () => {
    // TODO: Save MFA preferences
    // TODO: Update security level
    alert('MFA preferences saved successfully');
    if (securityLevel < 1) {
      await updateSecurityLevel(1);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MFA Alerts</Text>
      <Text style={styles.description}>
      Receive alerts to your phone or email for important wallet actions.
      </Text>

      <Text style={styles.description}>
        Choose how to receive your MFA alert:
      </Text>
      
      <View style={styles.option}>
        <Text>Phone</Text>
        <Switch />
      </View>

      <View style={styles.option}>
        <Text>Email</Text>
        <Switch />
      </View>

      <Text style={styles.description}>
        Choose when you want to receive Multi-Factor Authentication alerts:
      </Text>

      <View style={styles.option}>
        <Text>MFA upon login</Text>
        <Switch value={loginAlert} onValueChange={setLoginAlert} />
      </View>

      <View style={styles.option}>
        <Text>MFA for transactions over $100</Text>
        <Switch value={largeTransactionAlert} onValueChange={setLargeTransactionAlert} />
      </View>

      <Button title="Save Preferences" onPress={handleSubmit} />
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
    fontStyle: "bold"
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default MFAScreen;

// TODO: Implement saving of MFA preferences
// TODO: Handle success/error states