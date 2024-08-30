import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native'
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import { Input, Button } from 'react-native-elements';

const EmailBackupScreen = ({ navigation }) => {
    const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { wallets, updateSecurityLevel, securityLevel } = useContext(WalletContext);

  const handleSubmit = async () => {
    setModalVisible(true);
    alert('Email Backup set up successfully');
    if (securityLevel < 1) {
        await updateSecurityLevel(1);
      }
  };

  const handleConfirmBackup = async () => {
    // TODO: Implement email backup logic
    setModalVisible(false);
    alert('Email sent, check your inbox!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Backup</Text>
      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Submit" onPress={handleSubmit} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Do you want to send your wallet credentials now?</Text>
          <Button title="Yes" onPress={handleConfirmBackup} />
          <Button title="No" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
});

export default EmailBackupScreen;

// TODO: Implement email validation
// TODO: Implement actual email sending functionality
// TODO: Handle success/error states