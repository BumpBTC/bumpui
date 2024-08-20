import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, ScrollView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { wallets, enableTaproot, setEnableTaproot, importWallet, updateSecurityLevel } = useContext(WalletContext);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [accountDetailsModalVisible, setAccountDetailsModalVisible] = useState(false);
  const [importMnemonic, setImportMnemonic] = useState('');
  const [securityLevel, setSecurityLevel] = useState('basic');
  const [selectedWallet, setSelectedWallet] = useState('bitcoin');
  const [password, setPassword] = useState('');

  const securityOptions = [
    { label: 'Basic (Weakest)', value: 'basic', description: 'No web2 connections, only ICP-based identity.' },
    { label: 'Email Backup', value: 'email', description: 'Adds email-based recovery option.' },
    { label: 'Phone Backup', value: 'phone', description: 'Adds phone number-based recovery.' },
    { label: 'Multi-Factor', value: 'multi', description: 'Combines email and phone backup.' },
    { label: 'Authenticator App', value: 'authenticator', description: 'Adds TOTP-based authentication.' },
    { label: 'Hardware Key', value: 'hardware', description: 'Strongest security with hardware key support.' },
  ];

  const handleImportWallet = async () => {
    try {
      await importWallet(importMnemonic);
      Alert.alert('Success', 'Wallet imported successfully');
      setImportModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleShowAccountDetails = () => {
    // Here you would typically verify the password before showing account details
    // For this example, we'll just show the modal
    setAccountDetailsModalVisible(true);
  };

  const handleUpdateSecurityLevel = async () => {
    try {
      await updateSecurityLevel(securityLevel);
      Alert.alert('Success', 'Security level updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
 <Text style={[styles.walletText, { color: colors.text }]}>Security Level - 1</Text>
      <Button 
        title="Update Security Level" 
        onPress={() => navigation.navigate('Security')}
        style={styles.button}
        icon="shield-check"
      />
      
      <Text style={[styles.walletText, { color: colors.text, marginTop: 30 }]}>Account Options</Text>
      <Button 
        title="Account Details" 
        onPress={() => setAccountDetailsModalVisible(true)}
        style={styles.button}
      />
      <Button title="Import Wallet" onPress={() => setImportModalVisible(true)} style={styles.button} icon="wallet-plus" />
      <Button title="Remove Account" onPress={() => Alert.alert('Not implemented', 'This feature is not yet implemented.')} style={styles.button} icon="account-remove" />
      <Button title="Reset Password" onPress={() => Alert.alert('Not implemented', 'This feature is not yet implemented.')} style={styles.button} icon="lock-reset" />
      <Button title="Privacy Settings" onPress={() => Alert.alert('Not implemented', 'This feature is not yet implemented.')} style={styles.button} icon="shield-lock" />
      
      {wallets.map(wallet => (
        <View key={wallet.type} style={styles.walletItem}>
          <Icon name={wallet.type === 'bitcoin' ? 'bitcoin' : wallet.type === 'lightning' ? 'flash' : 'litecoin'} size={24} color={colors.primary} />
          <Text style={[styles.walletText, { color: colors.text }]}>{wallet.type.toUpperCase()} Wallet</Text>
          <Text style={[styles.addressText, { color: colors.text }]}>Public Key: {wallet.publicKey}</Text>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={importModalVisible}
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Import Wallet</Text>
          <Input
            placeholder="Enter mnemonic phrase"
            value={importMnemonic}
            onChangeText={setImportMnemonic}
            multiline
          />
          <Button title="Import" onPress={handleImportWallet} style={styles.modalButton} />
          <Button title="Cancel" onPress={() => setImportModalVisible(false)} style={styles.modalButton} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={accountDetailsModalVisible}
        onRequestClose={() => setAccountDetailsModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Account Details</Text>
          <Input
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Show Details" onPress={handleShowAccountDetails} style={styles.modalButton} />
          <Button title="Cancel" onPress={() => setAccountDetailsModalVisible(false)} style={styles.modalButton} />
        </View>
      </Modal>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.accent, true: colors.primary }}
          thumbColor={isDarkMode ? colors.background : colors.text}
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: colors.text }]}>Enable Taproot</Text>
        <Switch 
          value={enableTaproot} 
          onValueChange={setEnableTaproot}
          trackColor={{ false: colors.accent, true: colors.primary }}
          thumbColor={enableTaproot ? colors.background : colors.text}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  button: {
    marginTop: 20,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  walletText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  addressText: {
    fontSize: 12,
    marginLeft: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButton: {
    marginTop: 10,
  },
});

export default SettingsScreen;