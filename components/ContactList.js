import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ContactList = ({ contacts, onContactPress, selectedContact }) => {
  const { colors } = useTheme();

  const renderContact = ({ item }) => (
    <TouchableOpacity onPress={() => onContactPress(item)}>
      <View style={[
        styles.contactItem,
        { backgroundColor: colors.card },
        selectedContact && selectedContact._id === item._id && styles.selectedContact
      ]}>
        <Image
          source={item.picture ? { uri: item.picture } : require('../assets/default-avatar.png')}
          style={styles.avatar}
        />
        <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
        {selectedContact && selectedContact._id === item._id && (
          <Icon name="check-circle" size={24} color="green" style={styles.checkIcon} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={contacts}
      renderItem={renderContact}
      keyExtractor={(item) => item._id}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contactName: {
    fontSize: 16,
  },
  selectedContact: {
    borderColor: 'green',
    borderWidth: 2,
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default ContactList;