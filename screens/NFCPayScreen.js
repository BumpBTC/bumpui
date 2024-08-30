import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Animated } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { Svg, Path } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import { LinearGradient } from 'expo-linear-gradient';
import BalanceDisplay from '../components/BalanceDisplay';

const NFCPayScreen = () => {
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [nfcChannelBalance, setNfcChannelBalance] = useState(0);
  const [mode, setMode] = useState('send'); // 'send' or 'receive'
  const { colors } = useTheme();
  const { createNfcInvoice, payNfcInvoice, getNfcChannelBalance } = useContext(WalletContext);

  const pixelAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pixelAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pixelAnimation, { toValue: 0, duration: 1000, useNativeDriver: true })
      ])
    ).start();

    const checkNfcSupport = async () => {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setIsNfcSupported(true);
      }
    };
    checkNfcSupport();
    fetchNfcChannelBalance();

    return () => NfcManager.cancelTechnologyRequest().catch(() => 0);
  }, []);

  const fetchNfcChannelBalance = async () => {
    try {
      const balance = await getNfcChannelBalance();
      setNfcChannelBalance(balance);
    } catch (error) {
      console.error('Failed to fetch NFC channel balance:', error);
    }
  };

  const handleNfcPayment = useCallback(async () => {
    if (!isNfcSupported) {
      Alert.alert('Error', 'NFC is not supported on this device');
      return;
    }

    setIsProcessing(true);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      if (mode === 'send') {
        const invoice = await createNfcInvoice(parseFloat(amount), 'NFC Payment');
        const ndef = Ndef.encodeMessage([Ndef.textRecord(invoice.paymentRequest)]);
        await NfcManager.setNdefPush(ndef);
        Alert.alert('Ready to Send', 'Touch phones to initiate transfer');
      } else {
        const tag = await NfcManager.getTag();
        if (!tag) throw new Error('No tag found');

        const ndef = tag.ndefMessage[0];
        const paymentRequest = Ndef.text.decodePayload(ndef.payload);

        await payNfcInvoice(paymentRequest);
        Alert.alert('Success', 'Payment received successfully');
      }

      setIsComplete(true);
      fetchNfcChannelBalance();
    } catch (error) {
      console.error('NFC payment error:', error);
      Alert.alert('Error', error.message || 'Failed to complete NFC payment');
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => 0);
      setIsProcessing(false);
    }
  }, [isNfcSupported, mode, amount, createNfcInvoice, payNfcInvoice]);

  const pixelStyle = {
    opacity: pixelAnimation
  };

  if (isComplete) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LottieView
          source={require('../assets/success-animation.json')}
          autoPlay
          loop={false}
          style={styles.successAnimation}
        />
        <Text style={[styles.completeText, { color: colors.text }]}>
          {mode === 'send' ? 'Payment Sent!' : 'Payment Received!'}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#000033', '#333333']} style={styles.container}>
        <TouchableOpacity
        style={[styles.payButton, { backgroundColor: colors.lightning }]}
        onPress={handleNfcPayment}
        disabled={isProcessing}
      >
        <Animated.View style={[styles.pixelOverlay, pixelStyle]} />
        <Svg height="80" width="80" viewBox="0 0 24 24" style={styles.nfcIcon}>
          <Path
            d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"
            fill="#FFFFFF"
          />
        </Svg>
        <Text style={styles.payButtonText}>
          {isProcessing ? 'Processing...' : 'Give your buddy a bump!'}
        </Text>
      </TouchableOpacity>
      <BalanceDisplay
        type="lightning"
        balance={nfcChannelBalance}
        currency="USD"
      />
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'send' && styles.activeMode]}
          onPress={() => setMode('send')}
        >
          <Text style={styles.modeButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'receive' && styles.activeMode]}
          onPress={() => setMode('receive')}
        >
          <Text style={styles.modeButtonText}>Receive</Text>
        </TouchableOpacity>
      </View>
      {mode === 'send' && (
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount in USD"
          keyboardType="numeric"
          placeholderTextColor="#FFFFFF"
        />
      )}

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modeButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  activeMode: {
    backgroundColor: '#666',
  },
  modeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  amountInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#FFFFFF',
  },
  payButton: {
    width: 300,
    height: 300,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pixelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  nfcIcon: {
    marginBottom: 10,
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  completeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default NFCPayScreen;
