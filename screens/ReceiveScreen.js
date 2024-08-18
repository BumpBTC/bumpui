import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Share, Picker, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Button from '../components/Button';
import * as Clipboard from 'expo-clipboard';
import { WalletContext } from '../contexts/WalletContext';
import { ThemeContext } from '../contexts/ThemeContext';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const ReceiveScreen = () => {
  const { wallets, btcAddress, createLightningInvoice } = useContext(WalletContext);
  const { colors } = useContext(ThemeContext);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [qrValue, setQrValue] = useState('');
  const [lightningInvoice, setLightningInvoice] = useState('');

  useEffect(() => {
    if (selectedCoin === 'lightning') {
      generateLightningInvoice();
    } else {
      const wallet = wallets.find(w => w.type === selectedCoin);
      setQrValue(wallet ? wallet.address : btcAddress || 'Loading...');
    }
  }, [selectedCoin, btcAddress, wallets]);

  const generateLightningInvoice = async () => {
    try {
      const invoice = await createLightningInvoice(1000, 'Test Invoice');
      setLightningInvoice(invoice.paymentRequest);
      setQrValue(invoice.paymentRequest);
    } catch (error) {
      console.error('Error generating Lightning invoice:', error);
      setQrValue('Error generating invoice');
      Alert.alert('Error', 'Failed to generate Lightning invoice');
    }
  };

  const handleCopy = () => {
    const valueToCopy = selectedCoin === 'lightning' ? lightningInvoice : qrValue;
    Clipboard.setString(valueToCopy);
    Alert.alert('Success', 'Address copied to clipboard');
  };

  const handleShare = async () => {
    try {
      const message = selectedCoin === 'lightning' 
        ? `My Lightning invoice: ${lightningInvoice}`
        : `My ${selectedCoin.toUpperCase()} address: ${qrValue}`;
      await Share.share({ message });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient colors={[colors.background, colors.primary + '22']} style={styles.container}>
      <Animatable.View animation="fadeIn" style={styles.content}>
        <Picker
          selectedValue={selectedCoin}
          style={[styles.picker, { color: colors.text }]}
          onValueChange={(itemValue) => setSelectedCoin(itemValue)}
        >
          <Picker.Item label="Bitcoin" value="bitcoin" />
          <Picker.Item label="Lightning" value="lightning" />
          <Picker.Item label="Litecoin" value="litecoin" />
        </Picker>
        <Animatable.View animation="zoomIn" style={styles.qrContainer}>
          {qrValue ? (
            <QRCode
              value={qrValue}
              size={200}
              color={colors.text}
              backgroundColor={colors.background}
            />
          ) : (
            <Text style={{ color: colors.text }}>Loading QR Code...</Text>
          )}
        </Animatable.View>
        <Text style={[styles.address, { color: colors.text }]}>
          {selectedCoin === 'lightning' ? lightningInvoice : qrValue}
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="Copy Address" onPress={handleCopy} style={styles.button} />
          <Button title="Share Address" onPress={handleShare} style={styles.button} />
        </View>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  picker: {
    width: 200,
    marginBottom: 20,
  },
  qrContainer: {
    marginVertical: 30,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  address: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    width: '45%',
  },
});

export default ReceiveScreen;