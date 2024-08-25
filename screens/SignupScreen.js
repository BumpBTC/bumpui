import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Switch,
  Text,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../services/api";
import { saveToken } from "../services/auth";
import { WalletContext } from "../contexts/WalletContext";
import { useTheme } from "../contexts/ThemeContext";
import BackupModal from "../components/BackupModal";

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
  const { login, setSelectedCrypto } = useContext(WalletContext);
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
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        username,
        password,
        email,
        createBitcoin,
        createLitecoin,
        createLightning,
      });
      console.log("Signup successful:", response.data);
      navigation.navigate("Home", { user: response.data.user });
    } catch (error) {
      console.error("Signup error:", error.response.data);
    }
  };

  const handleBackupComplete = async (backedUp, backupEmail) => {
    setShowBackupModal(false);
    try {
      const { token, user } = await api.post("/auth/complete-signup", {
        backedUp,
        email: backupEmail || email,
      });
      await login(token);
      setSelectedCrypto(selectedWalletType);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error("Error completing signup:", error);
      Alert.alert("Error", "Failed to complete signup. Please try again.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Enter a username"
        leftIcon={
          <Ionicons name="person-outline" size={24} color={colors.text} />
        }
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Create a password"
        leftIcon={
          <Ionicons name="lock-closed-outline" size={24} color={colors.text} />
        }
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm your password"
        leftIcon={
          <Ionicons name="lock-closed-outline" size={24} color={colors.text} />
        }
      />
      <TextInput
        label="Email (optional)"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <View style={styles.walletSelection}>
      <View style={styles.switchContainer}>
        <Text>Create Bitcoin Wallet</Text>
        <Switch value={createBitcoin} onValueChange={setCreateBitcoin} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Create Litecoin Wallet</Text>
        <Switch value={createLitecoin} onValueChange={setCreateLitecoin} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Create Lightning Channel</Text>
        <Switch value={createLightning} onValueChange={setCreateLightning} />
      </View>
        <Text style={[styles.walletLabel, { color: colors.text }]}>
          Select Wallet Type:
        </Text>
        {["bitcoin", "lightning", "litecoin"].map((type) => (
          <View key={type} style={styles.walletOption}>
            <Text style={[styles.walletType, { color: colors.text }]}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Wallet
            </Text>
            <Switch
              value={selectedWalletType === type}
              onValueChange={() => setSelectedWalletType(type)}
              trackColor={{ false: colors.accent, true: colors.primary }}
            />
          </View>
        ))}
      </View>
      <Button title="Sign Up" onPress={handleSignup} />
      <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log in
      </Text>
      
      <Button title="Create Account" onPress={handleSignup} />

      <BackupModal
        visible={showBackupModal}
        walletData={walletData}
        onComplete={handleBackupComplete}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
