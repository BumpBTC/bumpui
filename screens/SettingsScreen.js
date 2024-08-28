import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import { Button, Input } from "react-native-elements";
import LottieView from "lottie-react-native";
import api from "../services/api";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const SettingsScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const {
    wallets,
    enableTaproot,
    setEnableTaproot,
    importWallet,
    updateSecurityLevel,
    fetchWalletData,
    removeWallet,
    setActiveWallet,
  } = useContext(WalletContext);
  const [importWalletModalVisible, setImportWalletModalVisible] =
    useState(false);
  const [createWalletModalVisible, setCreateWalletModalVisible] =
    useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] =
    useState(false);
  const [accountDetailsModalVisible, setAccountDetailsModalVisible] =
    useState(false);
  const [removeAccountModalVisible, setRemoveAccountModalVisible] =
    useState(false);
  const [importMnemonic, setImportMnemonic] = useState("");
  const [importType, setImportType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [importModalVisible, setimportModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const [walletType, setWalletType] = useState("");
  const [securityLevel, setSecurityLevel] = useState("basic");
  const [selectedWallet, setSelectedWallet] = useState("bitcoin");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activeWallets, setActiveWallets] = useState({});

  const securityOptions = [
    {
      label: "Basic (Weakest)",
      value: "basic",
      description: "No web2 connections, only ICP-based identity.",
    },
    {
      label: "Email Backup",
      value: "email",
      description: "Adds email-based recovery option.",
    },
    {
      label: "Phone Backup",
      value: "phone",
      description: "Adds phone number-based recovery.",
    },
    {
      label: "Multi-Factor",
      value: "multi",
      description: "Combines email and phone backup.",
    },
    {
      label: "Authenticator App",
      value: "authenticator",
      description: "Adds TOTP-based authentication.",
    },
    {
      label: "Hardware Key",
      value: "hardware",
      description: "Strongest security with hardware key support.",
    },
  ];

  useEffect(() => {
    fetchWalletData();
    const active = {};
    wallets.forEach((wallet) => {
      if (wallet.isActive) {
        active[wallet.type] = wallet.id;
      }
    });
    setActiveWallets(active);
  }, [wallets, fetchWalletData]);

  const handleCreateWallet = async (type) => {
    try {
      // Simulating wallet creation
      Alert.alert(
        "Success",
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } wallet created successfully.`
      );
      setModalVisible(false);
      fetchWalletData();
    } catch (error) {
      Alert.alert("Error", "Failed to create wallet");
    }
  };

  const handleImportWallet = async () => {
    try {
      await importWallet(importMnemonic, "bitcoin"); // Assuming Bitcoin for this example
      Alert.alert("Success", "Wallet imported successfully");
      setModalVisible(false);
      fetchWalletData();
    } catch (error) {
      Alert.alert("Error", "Failed to import wallet");
    }
  };

  const handleRemoveAccount = async () => {
    try {
      await api.delete("/wallet/remove-account");
      Alert.alert("Success", "Account removed successfully");
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (error) {
      Alert.alert("Error", "Failed to remove account");
    }
  };

  const handleResetPassword = async () => {
    try {
      await api.post("/wallet/reset-password", { password, newPassword });
      Alert.alert("Success", "Password reset successfully");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to reset password");
    }
  };

  const handleSetActiveWallet = async (type, walletId) => {
    try {
      await setActiveWallet(type, walletId);
      Alert.alert("Success", `Active ${type} wallet updated`);
      fetchWalletData();
    } catch (error) {
      Alert.alert("Error", "Failed to update active wallet");
    }
  };

  const handleShowAccountDetails = () => {
    // Here you would typically verify the password before showing account details
    // For this example, we'll just show the modal
    setAccountDetailsModalVisible(true);
  };

  const handleUpdateSecurityLevel = async () => {
    try {
      await updateSecurityLevel(securityLevel);
      Alert.alert("Success", "Security level updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const gradientColors = isDarkMode
    ? [colors.background, colors.primary + "44"]
    : [colors.background, colors.primary + "22"];

  const renderWalletTile = (type) => {
    const walletsOfType = wallets.filter((w) => w.type === type);
    const hasWallet = walletsOfType.length > 0;
    return (
      <TouchableOpacity
        style={[
          styles.tile,
          { backgroundColor: hasWallet ? colors.primary : colors.card },
        ]}
        onPress={() => {
          if (hasWallet) {
            setModalContent(
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Wallets
                </Text>
                {walletsOfType.map((wallet) => (
                  <TouchableOpacity
                    key={wallet.id}
                    style={[
                      styles.walletOption,
                      wallet.id === activeWallets[type] &&
                        styles.activeWalletOption,
                    ]}
                    onPress={() => handleSetActiveWallet(type, wallet.id)}
                  >
                    <Text
                      style={[styles.walletOptionText, { color: colors.text }]}
                    >
                      {wallet.address.substring(0, 10)}...
                    </Text>
                    {wallet.id === activeWallets[type] && (
                      <Icon name="check" size={24} color={colors.text} />
                    )}
                  </TouchableOpacity>
                ))}
                <Button
                  title="Close"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                />
              </View>
            );
          } else {
            setModalContent(
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Import {type} Wallet
                </Text>
                <Input
                  placeholder="Enter mnemonic phrase"
                  value={importMnemonic}
                  onChangeText={setImportMnemonic}
                  multiline
                />
                <Button
                  title="Import"
                  onPress={() => {
                    setImportType(type);
                    handleImportWallet();
                  }}
                  style={styles.modalButton}
                />
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                />
              </View>
            );
          }
          setModalVisible(true);
        }}
      >
        <Icon
          name={type === "bitcoin" ? "bitcoin" : "litecoin"}
          size={24}
          color={hasWallet ? colors.background : colors.text}
        />
        <Text
          style={[
            styles.tileText,
            { color: hasWallet ? colors.background : colors.text },
          ]}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
        <Text
          style={[
            styles.tileSubText,
            { color: hasWallet ? colors.background : colors.text },
          ]}
        >
          {hasWallet ? "Active" : "Import"}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSettingsTile = (icon, title, onPress) => (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <Icon name={icon} size={24} color={colors.text} />
      <Text style={[styles.tileText, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  const handleRemoveWallet = async (type) => {
    try {
      await removeWallet(type);
      Alert.alert(
        "Success",
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } wallet removed successfully`
      );
      fetchWalletData();
    } catch (error) {
      Alert.alert("Error", "Failed to remove wallet");
    }
  };

  const renderTile = (icon, title, onPress, color = colors.primary) => (
    <TouchableOpacity
      onPress={() => {
        animateTile();
        onPress();
      }}
    >
      <Animated.View
        style={[
          styles.tile,
          {
            backgroundColor: colors.card,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[color, colors.background]}
          style={styles.tileGradient}
        >
          <MaterialIcons name={icon} size={36} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient style={styles.container} colors={gradientColors}>
      <ScrollView>
        {" "}
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={styles.tileContainer}>
          {renderSettingsTile("wallet-plus", "Create Wallet", () => {
            setModalContent(
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Create Wallet
                </Text>
                <TouchableOpacity
                  onPress={() => handleCreateWallet("bitcoin")}
                  // onPress={navigation.navigate('CreateWallet')}
                  style={styles.modalOption}
                >
                  <Icon name="bitcoin" size={24} color={colors.primary} />
                  <Text
                    style={[styles.modalOptionText, { color: colors.text }]}
                  >
                    Bitcoin
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleCreateWallet("litecoin")}
                  // onPress={navigation.navigate('CreateWallet')}
                  style={styles.modalOption}
                >
                  <Icon name="litecoin" size={24} color={colors.primary} />
                  <Text
                    style={[styles.modalOptionText, { color: colors.text }]}
                  >
                    Litecoin
                  </Text>
                </TouchableOpacity>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                />
              </View>
            );
            setModalVisible(true);
          })}
          {renderWalletTile("bitcoin")}
          {renderWalletTile("litecoin")}
          <TouchableOpacity
            style={[styles.tile, { backgroundColor: colors.card }]}
            onPress={() => setAccountDetailsModalVisible(true)}
          >
            <Icon name="account-details" size={24} color={colors.text} />
            <Text style={[styles.tileText, { color: colors.text }]}>
              Account Details
            </Text>
          </TouchableOpacity>
          {renderSettingsTile("account-remove", "Remove Account", () => {
            setModalContent(
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Remove Account
                </Text>
                <Text style={[styles.modalText, { color: colors.text }]}>
                  Are you sure you want to remove your account? This action
                  cannot be undone.
                </Text>
                <Button
                  title="Remove Account"
                  onPress={handleRemoveAccount}
                  style={[styles.modalButton, { backgroundColor: "red" }]}
                />
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                />
              </View>
            );
            setModalVisible(true);
          })}
          {renderSettingsTile("lock-reset", "Reset Password", () => {
            setModalContent(
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Reset Password
                </Text>
                <Input
                  placeholder="Current Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <Input
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                <Button
                  title="Reset Password"
                  onPress={handleResetPassword}
                  style={styles.modalButton}
                />
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                />
              </View>
            );
            setModalVisible(true);
          })}
          {renderSettingsTile("shield-check", "Security Settings", () =>
            navigation.navigate("Security")
          )}
        </View>
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.accent, true: colors.primary }}
            thumbColor={isDarkMode ? colors.background : colors.text}
          />
        </View>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={[styles.modalView, { backgroundColor: colors.background }]}
          >
            {modalContent}
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  settingText: {
    fontSize: 18,
  },
  button: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    padding: 10,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  tileContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  tile: {
    borderRadius: 22,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tileText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  tileSubText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  walletText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  walletOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
  },
  activeWalletOption: {
    backgroundColor: "#d0d0d0",
  },
  walletOptionText: {
    fontSize: 16,
  },
  addressText: {
    fontSize: 12,
    marginLeft: 10,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  modalOptionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalButton: {
    marginTop: 10,
  },
});

export default SettingsScreen;
