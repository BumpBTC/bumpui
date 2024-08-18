import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useTheme } from '../contexts/ThemeContext';
import { WalletContext } from '../contexts/WalletContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';

const CustomDrawerContent = (props) => {
  const { colors, toggleTheme } = useTheme();
  const { logout } = React.useContext(WalletContext);

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: colors.background }}>
      <View style={styles.drawerHeader}>
        <Text style={[styles.drawerHeaderText, { color: colors.text }]}>Bump BTC Wallet</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Toggle Theme"
        onPress={toggleTheme}
        icon={({ color, size }) => (
          <Icon name="theme-light-dark" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="Logout"
        onPress={logout}
        icon={({ color, size }) => (
          <Icon name="logout" color={color} size={size} />
        )}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeToggleContainer: {
    padding: 20,
  },
  themeToggleButton: {
    marginTop: 20,
  },
});

export default CustomDrawerContent;