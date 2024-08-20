import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, Switch, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import Button from '../components/Button';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const CreateInvoiceScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isBtc, setIsBtc] = useState(false);
  const [btcAmount, setBtcAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const { createLightningInvoice, convertAmount } = useContext(WalletContext);

  useEffect(() => {
    if (isBtc) {
      setAmount(btcAmount);
    } else {
      setAmount(usdAmount);
    }
  }, [isBtc, btcAmount, usdAmount]);

  const handleAmountChange = (value) => {
    if (isBtc) {
      setBtcAmount(value);
      // Convert BTC to USD
      api.get(`/convert?amount=${value}&from=BTC&to=USD`)
        .then(response => setUsdAmount(response.data.amount))
        .catch(error => console.error('Conversion error:', error));
    } else {
      setUsdAmount(value);
      // Convert USD to BTC
      api.get(`/convert?amount=${value}&from=USD&to=BTC`)
        .then(response => setBtcAmount(response.data.amount))
        .catch(error => console.error('Conversion error:', error));
    }
  };

  const handleCreateInvoice = async () => {
    if (!amount || !memo) {
      Alert.alert('Error', 'Please enter both amount and memo');
      return;
    }

    try {
      const amountInSats = isBtc 
      ? Math.round(parseFloat(amount) * 100000000) 
      : Math.round(convertAmount(parseFloat(amount), 'USD', 'BTC') * 100000000);

      const invoice = await createLightningInvoice(amountInSats, memo);
      navigation.navigate('QRCodeScreen', { invoice: invoice.paymentRequest });
      
      // const response = await api.post('/lightning/createInvoice', {
      //   amount: isBtc ? btcAmount : usdAmount,
      //   memo,
      //   isBtc,
      // });
      // navigation.navigate('QRCodeScreen', { invoice: response.data.paymentRequest });
    } catch (error) {
      console.error('Error creating invoice:', error);
      Alert.alert('Error', 'Failed to create invoice. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Create Lightning Invoice</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Amount"
        placeholderTextColor={colors.placeholder}
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
      />
      <View style={styles.switchContainer}>
        <Text style={{ color: colors.text }}>USD</Text>
        <Switch
          value={isBtc}
          onValueChange={(value) => setIsBtc(value)}
        />
        <Text style={{ color: colors.text }}>BTC</Text>
      </View>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Memo"
        placeholderTextColor={colors.placeholder}
        value={memo}
        onChangeText={setMemo}
      />
      <Button title="Create Invoice" onPress={handleCreateInvoice} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
    },
    qrContainer: {
      marginVertical: 30,
      padding: 10,
      borderRadius: 10,
      elevation: 5,
    },
    address: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    button: {
      width: '100%',
      marginTop: 20,
    },
    fullWidthButton: {
      width: '100%',
      marginTop: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    invoice: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
      },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
  });

export default CreateInvoiceScreen;