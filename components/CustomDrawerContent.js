import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";
import CurrencySelector from "./CurrencySelector";

const CustomDrawerContent = (props) => {
  const { colors, toggleTheme } = useTheme();
  const { logout, selectedCrypto } = useContext(WalletContext);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: colors.background }}
    >
      <View style={styles.drawerHeader}>
        <Image source={require("../assets/bump.png")} style={styles.logo} />
        {/* <Text style={[styles.drawerHeaderText, { color: colors.text }]}>
          Bump BTC Wallet
        </Text> */}
        <CurrencySelector />
      </View>

      <DrawerItemList {...props} />

      <DrawerItem
        label="Settings"
        onPress={() => setShowSettingsMenu(!showSettingsMenu)}
        icon={({ color, size }) => (
          <Ionicons name="settings-outline" color={color} size={size} />
        )}
      />

      {showSettingsMenu && (
        <View style={styles.settingsSubmenu}>
          <DrawerItem
            label="User Settings"
            onPress={() => props.navigation.navigate("Settings")}
          />
          <DrawerItem
            label="Security"
            onPress={() => props.navigation.navigate("Security")}
          />
          <DrawerItem
            label="Contacts"
            onPress={() => props.navigation.navigate("Contacts")}
          />
        </View>
      )}

      <DrawerItem
        label="Toggle Theme"
        onPress={toggleTheme}
        icon={({ color, size }) => (
          <Icon name="theme-light-dark" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
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
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logo: {
    width: 96,
    height: 33,
    alignItems: "center"
  },
  themeToggleContainer: {
    padding: 20,
  },
  themeToggleButton: {
    marginTop: 20,
  },
  settingsSubmenu: {
    marginLeft: 20,
  },
});

export default CustomDrawerContent;
