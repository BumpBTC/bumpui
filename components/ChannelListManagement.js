import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const ChannelListManagement = ({ channels, onCloseChannel }) => {
  const { colors } = useTheme();

  const renderChannelItem = ({ item }) => (
    <View style={[styles.channelItem, { backgroundColor: colors.card }]}>
      <Text style={[styles.channelText, { color: colors.text }]}>Node: {item.nodePubkey}</Text>
      <Text style={[styles.channelText, { color: colors.text }]}>Capacity: {item.capacity} sats</Text>
      <TouchableOpacity
        style={[styles.closeButton, { backgroundColor: colors.primary }]}
        onPress={() => onCloseChannel(item.channelId)}
      >
        <Text style={[styles.closeButtonText, { color: colors.background }]}>Close Channel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={channels}
        renderItem={renderChannelItem}
        keyExtractor={(item) => item.channelId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  channelItem: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  channelText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ChannelListManagement;
