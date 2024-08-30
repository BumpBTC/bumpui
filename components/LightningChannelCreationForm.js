import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';

const LightningChannelCreationForm = ({ onCreateChannel }) => {
  const [nodeUri, setNodeUri] = useState('');
  const [amount, setAmount] = useState('');

  const handleCreateChannel = () => {
    if (!nodeUri || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    onCreateChannel(nodeUri, parseInt(amount));
  };

  return (
    <View style={styles.container}>
      <Input
        label="Node URI"
        value={nodeUri}
        onChangeText={setNodeUri}
        placeholder="Enter Node URI"
      />
      <Input
        label="Amount (sats)"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount in satoshis"
        keyboardType="numeric"
      />
      <Button title="Create Channel" onPress={handleCreateChannel} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default LightningChannelCreationForm;
