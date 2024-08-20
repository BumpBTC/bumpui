import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import ContactList from '../components/ContactList';
import Button from '../components/Button';
import api from '../services/api';

const ContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const { colors } = useTheme();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const handleContactPress = (contact) => {
    navigation.navigate('ContactDetails', { contact });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ContactList contacts={contacts} onContactPress={handleContactPress} />
      <Button
        title="Add Contact"
        onPress={() => navigation.navigate('AddContact')}
        style={styles.addButton}
      />
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
});

export default ContactsScreen;