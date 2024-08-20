import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';

const EditContactScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const [name, setName] = useState(contact.name);
  const [bitcoinAddress, setBitcoinAddress] = useState(contact.bitcoinAddress);
  const [lightningPublicKey, setLightningPublicKey] = useState(contact.lightningPublicKey);
  const [litecoinAddress, setLitecoinAddress] = useState(contact.litecoinAddress);
  const { colors } = useTheme();

  const handleUpdateContact = async () => {
    try {
      await api.put(`/contacts/${contact._id}`, {
        name,
        bitcoinAddress,
        lightningPublicKey,
        litecoinAddress,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter contact name"
      />
      <Input
        label="Bitcoin Address"
        value={bitcoinAddress}
        onChangeText={setBitcoinAddress}
        placeholder="Enter Bitcoin address"
      />
      <Input
        label="Lightning Public Key"
        value={lightningPublicKey}
        onChangeText={setLightningPublicKey}
        placeholder="Enter Lightning public key"
      />
      <Input
        label="Litecoin Address"
        value={litecoinAddress}
        onChangeText={setLitecoinAddress}
        placeholder="Enter Litecoin address"
      />
      <Button title="Update Contact" onPress={handleUpdateContact} style={styles.updateButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  updateButton: {
    marginTop: 20,
  },
});

export default EditContactScreen;