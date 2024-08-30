import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MerchantScreen from './MerchantScreen';
import ShopperScreen from './ShopperScreen';
import ShopIntermediaryScreen from './ShopIntermediaryScreen';

const ShopScreen = () => {
  const [userType, setUserType] = useState(null);

  if (!userType) {
    return <ShopIntermediaryScreen onSelect={setUserType} />;
  }

  return userType === 'merchant' ? <MerchantScreen /> : <ShopperScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: '100%',
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  partnerText: {
    textAlign: 'center',
  },
});

export default ShopScreen;