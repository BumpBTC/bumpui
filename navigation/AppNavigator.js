import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import SendScreen from "../screens/SendScreen";
import ReceiveScreen from "../screens/ReceiveScreen";
import StakeScreen from "../screens/StakeScreen";
import NFCPayScreen from "../screens/NFCPayScreen";
import LightningScreen from "../screens/LightningScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TransactionStatusScreen from '../screens/TransactionStatusScreen';
import { useTheme } from "../contexts/ThemeContext";
import CustomDrawerContent from '../components/CustomDrawerContent';
import SecurityScreen from '../screens/SecurityScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.background,
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
      <Stack.Screen name="TransactionStatus" component={TransactionStatusScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
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
      <Drawer.Screen name="Stake" component={StakeScreen} />
      <Drawer.Screen name="NFC Pay" component={NFCPayScreen} />
      <Drawer.Screen name="Lightning" component={LightningScreen} />
      <Drawer.Screen name="Security" component={SecurityScreen} />
      <Drawer.Screen
        name="Main"
        component={MainStack}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.background,
          drawerStyle: { backgroundColor: colors.background },
          drawerLabelStyle: { color: colors.text },
        }}
      >
        <Drawer.Screen
          name="Main"
          component={MainStack}
          options={{ headerShown: false }}
        />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <MainStack />
//     </NavigationContainer>
//   );
// };

export default AppNavigator;
