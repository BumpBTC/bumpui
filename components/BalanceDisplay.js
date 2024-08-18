import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import * as Clipboard from 'expo-clipboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BalanceDisplay = ({ type, balance, currency, address }) => {
  const { colors } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [balance]);

  const copyAddressToClipboard = async () => {
    await Clipboard.setStringAsync(address);
    // Show a toast notification
    // You can use a library like react-native-toast-message for this
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.card, opacity: fadeAnim }]}>
      <Text style={[styles.label, { color: colors.text }]}>Balance:</Text>
      <Text style={[styles.balance, { color: colors.primary }]}>
        {balance} {currency}
      </Text>
      <Text style={[styles.walletType, { color: colors.text }]}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Wallet
      </Text>
      <TouchableOpacity onPress={copyAddressToClipboard} style={styles.addressContainer}>
        <Text style={[styles.address, { color: colors.secondary }]} numberOfLines={1} ellipsizeMode="middle">
          {address}
        </Text>
        <MaterialCommunityIcons name="content-copy" size={20} color={colors.secondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  walletType: {
    fontSize: 16,
    marginBottom: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    marginRight: 5,
  },
});

export default BalanceDisplay;