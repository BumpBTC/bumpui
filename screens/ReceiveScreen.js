import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { WalletContext } from '../contexts/WalletContext';
import { useTheme } from '../contexts/ThemeContext';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CurrencySelector from "../components/CurrencySelector";

const ReceiveScreen = () => {
  const { selectedCrypto, setSelectedCrypto } = useContext(WalletContext);
  const { colors } = useTheme();
  const [address, setAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    updateAddress();
  }, [selectedCrypto]);

  const updateAddress = () => {
    let newAddress = '';
    switch (selectedCrypto) {
      case 'bitcoin':
        newAddress = 'tb1quh87hzaw32sspf2ngufp6k9well2ms3t3rjw90';
        break;
      case 'lightning':
        newAddress = 'lntb1p3zahuxpp5duqqwj6x26j6t5hmk8p3puwkg6tmmrlz9nl6jv5h6fyhna6qksdqqcqzpgxqyz5vqsp5cjtffkx5uyuy9eghp8fr8r5t5q8k3xtcuhvtrpqsywjxnf6zyuq9qyyssqegukv4q2jq3x2dt2mx5evu4yrkfhtef2durzjsalv3hm0mswwcysyly435cx74fqqshltz9ydekyvnfgw0mzrm03nv85nfp0wj75dgspm72n2g';
        break;
      case 'litecoin':
        newAddress = 'QZNN5YKWg5YspZcLWkaLAvWsAEtEBAUQLH';
        break;
      default:
        newAddress = '';
    }
    setAddress(newAddress);
    validateAddress(newAddress);
  };

  const validateAddress = (addr) => {
    // Simple address validation
    let isValid = false;
    switch (selectedCrypto) {
      case 'bitcoin':
        isValid = addr.startsWith('tb1') && addr.length === 42;
        break;
      case 'lightning':
        isValid = addr.startsWith('lntb1') && addr.length > 50;
        break;
      case 'litecoin':
        isValid = addr.startsWith('Q') && addr.length > 24;
        break;
    }
    setIsValidAddress(isValid);
  };

  const handleCopy = () => {
    if (isValidAddress) {
      Clipboard.setString(address);
      Alert.alert('Success', 'Address copied to clipboard');
    } else {
      Alert.alert('Error', 'Invalid address');
    }
  };

  const renderQRCode = () => {
    if (isValidAddress) {
      return (
        <QRCode
          value={address}
          size={200}
          color={colors.text}
          backgroundColor={colors.background}
        />
      );
    } else {
      return (
        <View style={styles.invalidAddressContainer}>
          <MaterialCommunityIcons name="alert-circle" size={50} color={colors.error} />
          <Text style={[styles.invalidAddressText, { color: colors.error }]}>Invalid Address</Text>
        </View>
      );
    }
  };

  const renderShareModal = () => (
    <Modal
      visible={showShareModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowShareModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Share Address</Text>
          <View style={styles.socialIconsContainer}>
            {['telegram', 'instagram', 'facebook', 'email', 'whatsapp', 'twitter', 'discord'].map((platform) => (
              <TouchableOpacity key={platform} style={styles.socialIcon}>
                <MaterialCommunityIcons name={platform} size={30} color={colors.primary} />
                <Text style={[styles.socialText, { color: colors.text }]}>{platform}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.primary }]} onPress={() => setShowShareModal(false)}>
            <Text style={[styles.closeButtonText, { color: colors.background }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient colors={[colors.background, colors.primary + '22']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="fadeIn" style={styles.content}>
          <View style={styles.currencySelectorContainer}>
            <CurrencySelector
              selectedCrypto={selectedCrypto}
              onSelect={(crypto) => setSelectedCrypto(crypto)}
            />
          </View>
          
          <Animatable.View animation="zoomIn" style={styles.qrContainer}>
            {renderQRCode()}
          </Animatable.View>
          
          <Text style={[styles.address, { color: colors.text }]}>{address}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleCopy}>
              <MaterialCommunityIcons name="content-copy" size={24} color={colors.background} />
              <Text style={[styles.buttonText, { color: colors.background }]}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => setShowShareModal(true)}>
              <MaterialCommunityIcons name="share-variant" size={24} color={colors.background} />
              <Text style={[styles.buttonText, { color: colors.background }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
      {renderShareModal()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  currencySelectorContainer: {
    marginBottom: 10,
    paddingBottom: 4,
  },
  qrContainer: {
    padding: 20,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  address: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  shareOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shareOption: {
    alignItems: 'center',
    margin: 10,
  },
  socialText: {
    fontSize: 14,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialIcon: {
    alignItems: 'center',
    margin: 10,
    width: '25%',
  },
  socialIconText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  invalidAddressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  invalidAddressText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReceiveScreen;