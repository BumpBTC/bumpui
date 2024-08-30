import React, { useState, useContext } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WalletContext } from '../contexts/WalletContext';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const ConfirmationModal = ({ visible, onClose, details, navigation }) => {
  const { colors } = useTheme();
  const { sendTransaction } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await sendTransaction(details);
      setIsLoading(false);
      onClose();
      navigation.navigate('Home', {
        // status: 'success',
        // txid: response.txid,
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Transaction failed:', error);
      navigation.navigate('Home', {
        // status: 'error',
        // message: error.message,
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.modalContent}
        >
          <Text style={styles.title}>Confirm Transaction</Text>
          
          <View style={styles.detailsContainer}>
            <DetailItem icon="account-arrow-right" label="Recipient" value={details.recipient} />
            <DetailItem icon="currency-btc" label="Amount" value={`${details.amount} ${details.currency}`} />
            <DetailItem icon="speedometer" label="Network Fee" value={`${details.networkFee} ${details.currency}`} />
            <DetailItem icon="rocket-launch" label="Priority" value={details.priority.charAt(0).toUpperCase() + details.priority.slice(1)} />
            <DetailItem icon="calculator" label="Total" value={`${details.total} ${details.currency}`} highlight />
          </View>

          <LottieView
            source={require('../assets/success-animation.json')}
            autoPlay
            loop
            style={styles.animation}
          />

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.confirmText}>Swipe to Confirm</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const DetailItem = ({ icon, label, value, highlight }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.detailItem}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.text} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, highlight && styles.highlightedValue]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  highlightedValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4169E1',
  },
  animation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  confirmText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cancelButton: {
    padding: 10,
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ConfirmationModal;