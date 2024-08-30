import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import CurrencySelector from "./CurrencySelector";

const CustomDrawerContent = (props) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { logout, selectedCrypto } = useContext(WalletContext);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  const animatedValue = new Animated.Value(0);

  const animate = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    animate();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: colors.background }}
    >
      <Animated.View>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.drawerHeader}
        >
          <Image source={require("../assets/bump.png")} style={styles.logo} />
          <CurrencySelector />
        </LinearGradient>

        <DrawerItemList
          {...props}
          itemStyle={styles.drawerItem}
          labelStyle={[styles.drawerLabel, { color: colors.text }]}
          activeBackgroundColor={colors.activeDrawerItem}
        />

        <DrawerItem
          label="Settings"
          onPress={() => setShowSettingsMenu(!showSettingsMenu)}
          icon={({ color, size }) => (
            <Icon name="cog-outline" color={'blue'} size={size} />
          )}
          labelStyle={[styles.drawerLabel, { color: colors.text }]}
        />

        {showSettingsMenu && (
          <Animatable.View
            animation="fadeIn"
            duration={300}
            style={styles.settingsSubmenu}
          >
            <DrawerItem
              label="User Settings"
              onPress={() => props.navigation.navigate("Settings")}
              icon={({ color, size }) => (
                <Icon name="account-cog-outline" color={color} size={size} />
              )}
              labelStyle={[styles.drawerLabel, { color: colors.text }]}
            />
            <DrawerItem
              label="Security"
              onPress={() => props.navigation.navigate("Security")}
              icon={({ color, size }) => (
                <Icon name="shield-check-outline" color={color} size={size} />
              )}
              labelStyle={[styles.drawerLabel, { color: colors.text }]}
            />
            <DrawerItem
              label="Contacts"
              onPress={() => props.navigation.navigate("Contacts")}
              icon={({ color, size }) => (
                <Icon name="contacts-outline" color={color} size={size} />
              )}
              labelStyle={[styles.drawerLabel, { color: colors.text }]}
            />
          </Animatable.View>
        )}

        <DrawerItem
          label="Toggle Theme"
          onPress={toggleTheme}
          icon={({ color, size }) => (
            <Icon
              name={isDarkMode ? "weather-night" : "weather-sunny"}
              color={'green'}
              size={size}
            />
          )}
          labelStyle={[styles.drawerLabel, { color: colors.text }]}
        />
        <DrawerItem
          label="Logout"
          onPress={handleLogout}
          icon={({ color, size }) => (
            <Icon name="logout" color={'red'} size={size} />
          )}
          labelStyle={[styles.drawerLabel, { color: colors.text }]}
        />
      </Animated.View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    marginTop: -10,
    padding: 20,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 96,
    height: 33,
    resizeMode: "contain",
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingsSubmenu: {
    marginLeft: 20,
  },
});

export default CustomDrawerContent;