import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../services/api";
import { saveToken } from "../services/auth";
import { WalletContext } from "../contexts/WalletContext";
import { useTheme } from "../contexts/ThemeContext";
import BackupModal from "../components/BackupModal";
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createBitcoin, setCreateBitcoin] = useState(false);
  const [createLitecoin, setCreateLitecoin] = useState(false);
  const [createLightning, setCreateLightning] = useState(false);
  const [bitcoinWallet, setBitcoinWallet] = useState(false);
  const [lightningWallet, setLightningWallet] = useState(false);
  const [litecoinWallet, setLitecoinWallet] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [selectedWalletType, setSelectedWalletType] = useState("bitcoin");
  const { login, setWallets, setSelectedCrypto } = useContext(WalletContext);
  const { colors } = useTheme();

  // const handleSignup = async () => {
  //   if (password !== confirmPassword) {
  //     Alert.alert('Error', 'Passwords do not match');
  //     return;
  //   }

  //   if (!bitcoinWallet && !lightningWallet && !litecoinWallet) {
  //     Alert.alert('Error', 'Please select at least one wallet type');
  //     return;
  //   }

  //   try {
  //     const response = await api.post('/auth/register', {
  //       username,
  //       email,
  //       password,
  //       walletTypes: {
  //         bitcoin: bitcoinWallet,
  //         lightning: lightningWallet,
  //         litecoin: litecoinWallet
  //       }
  //     });

  //     const { token, user } = response.data;
  //     await saveToken(token);
  //     await login(token);
  //     setWalletData(user.wallets);
  //     navigation.navigate('Home', { walletData: user.wallets });
  //     // setShowBackupModal(true);

  //     if (email) {
  //       // TODO: Implement email backup functionality
  //       // This should be handled on the server-side
  //       Alert.alert('Success', 'Account created successfully. Check your email for wallet backup information.');
  //     } else {
  //       Alert.alert('Success', 'Account created successfully.');
  //     }

  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Home' }],
  //     });
  //   } catch (error) {
  //     console.error('Signup error:', error.response?.data || error.message);
  //     Alert.alert('Signup Failed', error.response?.data?.error || 'Failed to create account. Please try again.');
  //   }
  // };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await api.post("/auth/signup", {
        username,
        email,
        password,
      });
      console.log("Signup successful:", response.data);
      await login(response.data.token);
      setWallets(response.data.user.wallets || []);
      navigation.navigate("Home"); // Remove the user parameter
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      Alert.alert('Signup Failed', error.response?.data?.error || 'Failed to create account. Please try again.');
    }
  };

  // const handleBackupComplete = async (backedUp, backupEmail) => {
  //   setShowBackupModal(false);
  //   try {
  //     const { token, user } = await api.post("/auth/complete-signup", {
  //       backedUp,
  //       email: backupEmail || email,
  //     });
  //     await login(token);
  //     setSelectedCrypto(selectedWalletType);
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: "Home" }],
  //     });
  //   } catch (error) {
  //     console.error("Error completing signup:", error);
  //     Alert.alert("Error", "Failed to complete signup. Please try again.");
  //   }
  // };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter a username"
        placeholderTextColor={colors.text}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email (optional)"
        placeholderTextColor={colors.text}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Create a password"
        placeholderTextColor={colors.text}
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm your password"
        placeholderTextColor={colors.text}
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loginLink: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
  },
  walletSelection: {
    marginBottom: 20,
  },
  walletLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  walletOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  walletType: {
    fontSize: 14,
  },
});

export default SignupScreen;
