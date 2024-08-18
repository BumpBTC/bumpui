import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import { useTheme } from '../contexts/ThemeContext';

const BackupScreen = ({ route, navigation }) => {
  const [emailBackup, setEmailBackup] = useState(false);
  const [email, setEmail] = useState('');
  const { colors } = useTheme();
  const { walletData } = route.params || {};

  const handleEmailBackup = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      const result = await MailComposer.composeAsync({
        recipients: [email],
        subject: 'Your Wallet Backup',
        body: JSON.stringify(walletData, null, 2),
      });
      if (result.status === 'sent') {
        Alert.alert('Success', 'Backup sent successfully');
        navigation.navigate('Home');
      }
    } else {
      Alert.alert('Error', 'Email is not available on this device');
    }
  };

  const handleFileBackup = async () => {
    const fileUri = `${FileSystem.documentDirectory}wallet_backup.json`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(walletData, null, 2));
    await Sharing.shareAsync(fileUri);
  };

  if (!walletData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>No wallet data available for backup.</Text>
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Backup Your Wallet</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>Scan this QR code to save your wallet details</Text>
      
      <QRCode
        value={JSON.stringify(walletData)}
        size={200}
        color={colors.text}
        backgroundColor={colors.background}
      />

      <View style={styles.switchContainer}>
        <Text style={{ color: colors.text }}>Email Backup</Text>
        <Switch value={emailBackup} onValueChange={setEmailBackup} />
      </View>
      
      {emailBackup && (
        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      )}

      <Button title="Email Backup" onPress={handleEmailBackup} style={styles.button} />
      <Button title="Save to File" onPress={handleFileBackup} style={styles.button} />
      <Button
        title="I've Saved My Backup"
        onPress={() => navigation.navigate('Home')}
        style={styles.button}
      />
    </ScrollView>
  );
};

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
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default BackupScreen;