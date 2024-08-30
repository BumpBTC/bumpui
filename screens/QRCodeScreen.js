import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../contexts/ThemeContext';

const QRCodeScreen = ({ route }) => {
  const { colors } = useTheme();
  // const { invoice } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Scan to Pay</Text>
      <QRCode
        // value={invoice}
        size={200}
        color={colors.text}
        backgroundColor={colors.background}
      />
      {/* <Text style={[styles.invoice, { color: colors.text }]}>{invoice}</Text> */}
    </View>
  );
};

export default QRCodeScreen;