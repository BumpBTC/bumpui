import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CurrencySelector from './CurrencySelector';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, showCurrencySelector = false }) => {
  const navigation = useNavigation();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons name="menu" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <View style={styles.rightIcons}>
        {showCurrencySelector && <CurrencySelector />}
        <TouchableOpacity onPress={() => setShowSettingsMenu(!showSettingsMenu)}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {showSettingsMenu && (
        <View style={styles.settingsMenu}>
          <TouchableOpacity onPress={() => {
            navigation.navigate('Settings');
            setShowSettingsMenu(false);
          }}>
            <Text>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate('Contacts');
            setShowSettingsMenu(false);
          }}>
            <Text>Contacts</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
});

export default Header;