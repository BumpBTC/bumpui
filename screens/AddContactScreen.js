import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker';

const AddContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [lightningPublicKey, setLightningPublicKey] = useState('');
  const [litecoinAddress, setLitecoinAddress] = useState('');
  const [picture, setPicture] = useState(null);
  const { colors } = useTheme();

  const handleAddContact = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bitcoinAddress', bitcoinAddress);
      formData.append('lightningPublicKey', lightningPublicKey);
      formData.append('litecoinAddress', litecoinAddress);
      if (picture) {
        formData.append('picture', {
          uri: picture,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      await api.post('/contacts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to add contact:', error);
      Alert.alert('Error', 'Failed to add contact');
    }
  };

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
           <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoContainer}>
        <Image
          source={picture ? { uri: picture } : require('../assets/default-avatar.png')}
          style={styles.photo}
        />
      </TouchableOpacity>
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
      <Button title="Add Contact" onPress={handleAddContact} style={styles.addButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    marginTop: 20,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default AddContactScreen;