import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';

const ShopScreen = () => {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Image 
        source={require('../assets/square-logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colors.text }]}>Shop with Square</Text>
      <Text style={[styles.description, { color: colors.text }]}>
        Use your Bitcoin, Lightning, or Litecoin to shop at millions of merchants worldwide with Square integration.
      </Text>
      <Button 
        title="Connect Square Account" 
        onPress={() => {/* Implement Square account connection */}}
        style={styles.button}
      />
      <Button 
        title="Browse Merchants" 
        onPress={() => {/* Implement merchant browsing */}}
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
});

export default ShopScreen;