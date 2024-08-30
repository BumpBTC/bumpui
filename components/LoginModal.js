import React, { useState, useContext } from "react";
import { View, Text, Modal, StyleSheet, TextInput, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from "./Button";
import { signup, login } from "../services/api";
import { saveToken } from "../services/auth";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";

const LoginModal = ({ visible, onClose, navigation }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();
  const [error, setError] = useState("");
  const { fetchWalletData, setIsLoggedIn } = useContext(WalletContext);

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      await AsyncStorage.setItem('userToken', data.token);
      setIsLoggedIn(true);
      fetchWalletData();
    } catch (error) {
      console.error('Login failed:', error);
      // Show error message to user
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username or Email"
            placeholderTextColor={colors.placeholder}
            value={identifier}
            onChangeText={setIdentifier}
          />
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Password"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button title="Login" onPress={handleLogin} />
          <Button
            title="Cancel"
            onPress={onClose}
            style={styles.cancelButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "gray",
  },
});

export default LoginModal;
