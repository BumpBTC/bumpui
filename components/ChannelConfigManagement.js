import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { WalletContext } from '../contexts/WalletContext';
import { useTheme } from '../contexts/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';

const ChannelConfigManagement = () => {
  const { getChannelConfigurations, updateChannelConfiguration, deleteChannelConfiguration } = useContext(WalletContext);
  const { colors } = useTheme();
  const [configurations, setConfigurations] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [name, setName] = useState('');
  const [nodeUri, setNodeUri] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    const configs = await getChannelConfigurations();
    setConfigurations(configs);
  };

  const handleUpdateConfig = async () => {
    if (selectedConfig) {
      await updateChannelConfiguration(selectedConfig._id, { name, nodeUri, amount: parseInt(amount) });
      fetchConfigurations();
      setSelectedConfig(null);
    }
  };

  const handleDeleteConfig = async (configId) => {
    await deleteChannelConfiguration(configId);
    fetchConfigurations();
  };

  const renderConfigItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.configItem, { backgroundColor: colors.card }]}
      onPress={() => {
        setSelectedConfig(item);
        setName(item.name);
        setNodeUri(item.nodeUri);
        setAmount(item.amount.toString());
      }}
    >
      <Text style={[styles.configText, { color: colors.text }]}>{item.name}</Text>
      <Button title="Delete" onPress={() => handleDeleteConfig(item._id)} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={configurations}
        renderItem={renderConfigItem}
        keyExtractor={(item) => item._id}
      />
      <View style={styles.formContainer}>
        <Input label="Name" value={name} onChangeText={setName} />
        <Input label="Node URI" value={nodeUri} onChangeText={setNodeUri} />
        <Input label="Amount (sats)" value={amount} onChangeText={setAmount} keyboardType="numeric" />
        <Button title={selectedConfig ? "Update Configuration" : "Add Configuration"} onPress={handleUpdateConfig} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  configText: {
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
  },
});

export default ChannelConfigManagement;
