import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WalletContext } from '../contexts/WalletContext';
import { useTheme } from '../contexts/ThemeContext';

const CurrencySelector = () => {
  const { selectedCrypto, setSelectedCrypto } = useContext(WalletContext);
  const { setWalletTheme } = useTheme();

  const cryptos = ['bitcoin', 'lightning', 'litecoin'];

  const getCryptoIcon = (crypto) => {
    switch (crypto) {
      case 'bitcoin': return <MaterialCommunityIcons name="bitcoin" size={24} color="#F7931A" />;
      case 'lightning': return <MaterialCommunityIcons name="lightning-bolt" size={24} color="#792DE4" />;
      case 'litecoin': return <MaterialCommunityIcons name="litecoin" size={24} color="#345D9D" />;
      default: return null;
    }
  };

  const handleSelect = () => {
    const currentIndex = cryptos.indexOf(selectedCrypto);
    const nextIndex = (currentIndex + 1) % cryptos.length;
    const nextCrypto = cryptos[nextIndex];
    setSelectedCrypto(nextCrypto);
    setWalletTheme(nextCrypto);
  };

  return (
    <TouchableOpacity style={styles.selector} onPress={handleSelect}>
      <View style={styles.iconContainer}>
        {getCryptoIcon(selectedCrypto)}
      </View>
      <Text style={styles.cryptoName}>{selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 10,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CurrencySelector;