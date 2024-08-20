import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = useCallback(async () => {
    try {
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addContact = async (contactData) => {
    try {
      const response = await api.post('/contacts', contactData);
      setContacts([...contacts, response.data]);
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  const updateContact = async (contactId, contactData) => {
    try {
      const response = await api.put(`/contacts/${contactId}`, contactData);
      setContacts(contacts.map(c => c._id === contactId ? response.data : c));
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const deleteContact = async (contactId) => {
    try {
      await api.delete(`/contacts/${contactId}`);
      setContacts(contacts.filter(c => c._id !== contactId));
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  return (
    <ContactContext.Provider value={{ contacts, fetchContacts, addContact, updateContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  );
};