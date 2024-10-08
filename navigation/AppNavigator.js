import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "../screens/HomeScreen";
import SendScreen from "../screens/SendScreen";
import ReceiveScreen from "../screens/ReceiveScreen";
import StakeScreen from "../screens/StakeScreen";
import SignupScreen from "../screens/SignupScreen";
import NFCPayScreen from "../screens/NFCPayScreen";
import LightningScreen from "../screens/LightningScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TransactionStatusScreen from "../screens/TransactionStatusScreen";
import { useTheme } from "../contexts/ThemeContext";
import CustomDrawerContent from "../components/CustomDrawerContent";
import SecurityScreen from "../screens/SecurityScreen";
import ShopScreen from "../screens/ShopScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ContactDetailsScreen from "../screens/ContactDetailsScreen";
import AddContactScreen from "../screens/AddContactScreen";
import EditContactScreen from "../screens/EditContactScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import CreateWalletScreen from "../screens/CreateWalletScreen";
import BlockchainCredentialsScreen from "../screens/BlockchainCredentialsScreen";
import EmailBackupScreen from "../screens/EmailBackupScreen";
import PhoneBackupScreen from "../screens/PhoneBackupScreen";
import MFAScreen from "../screens/MFAScreen";
import GoogleAuthScreen from "../screens/GoogleAuthSetupScreen";
import HardwareKeyScreen from "../screens/HardwareKeyBackupScreen";
import BiometricsScreen from "../screens/BiometricsSetupScreen";
import BuyBitcoinScreen from "../screens/BuyBitcoinScreen";
import { WalletContext } from "../contexts/WalletContext";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

const SecurityStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SecurityOverview" component={SecurityScreen} />
    <Stack.Screen
      name="BlockchainCredentials"
      component={BlockchainCredentialsScreen}
    />
    <Stack.Screen name="EmailBackup" component={EmailBackupScreen} />
    <Stack.Screen name="PhoneBackup" component={PhoneBackupScreen} />
    <Stack.Screen name="MFA" component={MFAScreen} />
    <Stack.Screen name="Authenticator" component={GoogleAuthScreen} />
    <Stack.Screen name="HardwareKey" component={HardwareKeyScreen} />
    <Stack.Screen name="Biometrics" component={BiometricsScreen} />
  </Stack.Navigator>
);

const ContactsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Contacts" component={ContactsScreen} />
    <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} />
    <Stack.Screen name="AddContact" component={AddContactScreen} />
    <Stack.Screen name="EditContact" component={EditContactScreen} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Drawer.Screen name="Security" component={SecurityScreen} />
    <Stack.Screen name="Contacts" component={ContactsScreen} />
  </Stack.Navigator>
);

const MainStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.background,
        drawerStyle: { backgroundColor: colors.background },
        drawerLabelStyle: { color: colors.text },
      }}
    >
      <Stack.Screen
        name="MainDrawer"
        component={MainDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Send" component={SendScreen} />
      <Stack.Screen name="Receive" component={ReceiveScreen} />
      <Stack.Screen name="Stake" component={StakeScreen} />
      <Stack.Screen name="NFCPay" component={NFCPayScreen} />
      <Stack.Screen name="Lightning" component={LightningScreen} />
      <Stack.Screen
        name="TransactionStatus"
        component={TransactionStatusScreen}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
      />
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
      <Stack.Screen name="Security" component={SecurityStack} />
      <Drawer.Screen name="Contacts" component={ContactsStack} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const MainDrawer = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.background,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerStyle: { backgroundColor: colors.background },
        drawerLabelStyle: { color: colors.text },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <AnimatedIcon
              animation="bounceIn"
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Send"
        component={SendScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <AnimatedIcon
              animation="bounceIn"
              name="send"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Bump Pay"
        component={NFCPayScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <AnimatedIcon
              animation="bounceIn"
              name="nfc"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Receive"
        component={ReceiveScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <AnimatedIcon
              animation="bounceIn"
              name="qrcode"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <AnimatedIcon
              animation="bounceIn"
              name="shopping"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Buy Bitcoin"
        component={BuyBitcoinScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <AnimatedIcon
              animation="bounceIn"
              name="bitcoin"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { colors } = useTheme();
  const { isLoggedIn, checkLoginStatus } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const { fetchWalletData } = useContext(WalletContext);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem("userToken");
        if (token) {
          setUserToken(token);
          await fetchWalletData();
        }
      } catch (e) {
        // Restoring token failed
      }
      checkLoginStatus();
      setIsLoading(false);
    };

    bootstrapAsync();
    fetchWalletData();
  }, [fetchWalletData]);

  if (isLoading) {
    // You can show a loading screen here if you want
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={MainStack} />
            <Stack.Screen name="SettingsStack" component={SettingsStack} />
            <Stack.Screen
              name="TransactionStatus"
              component={TransactionStatusScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignUp" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
