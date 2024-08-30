import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import Button from '../components/Button';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const CreateWalletScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { createWallet, fetchWalletData } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);
//   const { walletType } = route.params;

  const handleCreateWallet = async () => {
    setIsLoading(true);
    try {
      await createWallet();
      await fetchWalletData();
      Alert.alert('Success', ` wallet created successfully!`);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating wallet:', error);
      Alert.alert('Error', `Failed to create wallet. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={[colors.background, colors.primary + '22']} style={styles.container}>
      <Animatable.View animation="fadeIn" style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Create Wallet</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          You are about to create a new wallet. This will generate a new address and private key for you.
        </Text>
        <Button
          title={`Create Wallet`}
          onPress={handleCreateWallet}
          loading={isLoading}
          style={styles.button}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    width: '100%',
  },
});

export default CreateWalletScreen;