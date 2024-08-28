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
import CreateWalletScreen from '../screens/CreateWalletScreen';
import { WalletContext } from "../contexts/WalletContext";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const ContactsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Contacts" component={ContactsScreen} />
    <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} />
    <Stack.Screen name="AddContact" component={AddContactScreen} />
    <Stack.Screen name="EditContact" component={EditContactScreen} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
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
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
      <Drawer.Screen name="Security" component={SecurityScreen} />
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
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.background,
        drawerStyle: { backgroundColor: colors.background },
        drawerLabelStyle: { color: colors.text },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Send" component={SendScreen} />
      <Drawer.Screen name="Receive" component={ReceiveScreen} />
      <Drawer.Screen name="Bump Pay" component={NFCPayScreen} />
      <Drawer.Screen name="Shop" component={ShopScreen} />
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
