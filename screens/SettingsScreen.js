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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");
const tileSize = (width - 60) / 2;

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

  const handleCreateWallet = useCallback(async (type) => {
    try {
      const response = await api.post("/wallet/create", { type });
      const newWallet = response.data.wallet;
      Alert.alert(
        "Success",
        `${type.charAt(0).toUpperCase() + type.slice(1)} wallet created successfully.\nAddress: ${newWallet.address}`
      );
      setModalVisible(false);
      fetchWalletData();
    } catch (error) {
      console.error('Error creating wallet:', error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to create wallet"
      );
    }
  }, [fetchWalletData]);

  const handleImportWallet = async () => {
    try {
      await importWallet(importMnemonic, importType);
      Alert.alert("Success", "Wallet imported successfully");
      setModalVisible(false);
      fetchWalletData();
    } catch (error) {
      Alert.alert("Error", error.message);
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
         <View style={styles.tileContainer}>
        {renderSettingsTile("wallet-plus", "Create Wallet", () => {
          setModalContent(
            <View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Create Wallet
              </Text>
              <TouchableOpacity
                onPress={() => handleCreateWallet("bitcoin")}
                style={styles.modalOption}
              >
                <Icon name="bitcoin" size={24} color={colors.primary} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>
                  Bitcoin
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCreateWallet("litecoin")}
                style={styles.modalOption}
              >
                <Icon name="litecoin" size={24} color={colors.primary} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>
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
        {renderSettingsTile("account-details", "Account Details", () => {
          setModalContent(
            <View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Account Details
              </Text>
              {wallets.map((wallet) => (
                <View key={wallet.type} style={styles.walletItem}>
                  <Icon
                    name={wallet.type === "bitcoin" ? "bitcoin" : "litecoin"}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={[styles.walletText, { color: colors.text }]}>
                    {wallet.type.toUpperCase()} Wallet
                  </Text>
                  <Text style={[styles.addressText, { color: colors.text }]}>
                    Public Key: {wallet.publicKey}
                  </Text>
                </View>
              ))}
              <Button
                title="Close"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              />
            </View>
          );
          setModalVisible(true);
        })}
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
      <View style={styles.tileContainer}>
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => setCreateWalletModalVisible(true)}
        >
          <Icon name="wallet-plus" size={24} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>
            Create Wallet
          </Text>
        </TouchableOpacity>
        {renderWalletTile("bitcoin")}
        {renderWalletTile("litecoin")}
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => setImportWalletModalVisible(true)}
        >
          <Icon name="wallet-outline" size={24} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>
            Import Wallet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => setAccountDetailsModalVisible(true)}
        >
          <Icon name="account-details" size={24} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>
            Account Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => setRemoveAccountModalVisible(true)}
        >
          <Icon name="account-remove" size={24} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>
            Remove Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => setResetPasswordModalVisible(true)}
        >
          <Icon name="lock-reset" size={24} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>
            Reset Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("Security")}
        >
          <Icon name="shield-check" size={24} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>
            Security Settings
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tileContainer}>
        {" "}
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => {
            setModalContent(
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Create Wallet
                </Text>
                <TouchableOpacity
                  onPress={() => handleCreateWallet("bitcoin")}
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
          }}
        >
          <Icon name="wallet-plus" size={24} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>
            Create Wallet
          </Text>
        </TouchableOpacity>
        {renderWalletTile("bitcoin")}
        {renderWalletTile("litecoin")}
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => {
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
          }}
        >
          <Icon name="account-remove" size={24} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>
            Remove Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => {
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
          }}
        >
          <Icon name="lock-reset" size={24} color={colors.text} />
          <Text style={[styles.tileText, { color: colors.text }]}>
            Reset Password
          </Text>
        </TouchableOpacity>
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

      <Text style={[styles.walletText, { color: colors.text }]}>
        Security Level - 1
      </Text>
      <Button
        title="Update Security Level"
        onPress={() => navigation.navigate("Security")}
        style={styles.button}
        icon="shield-check"
      />

      <Text style={[styles.walletText, { color: colors.text, marginTop: 30 }]}>
        Account Options
      </Text>
      <Button
        title="Account Details"
        onPress={() => setAccountDetailsModalVisible(true)}
        style={styles.button}
      />
      <Button
        title="Import Wallet"
        onPress={() => setImportModalVisible(true)}
        style={styles.button}
        icon="wallet-plus"
      />
      <Modal
        visible={isWalletModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsWalletModalVisible(false)}
      >
        <View
          style={[styles.modalView, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Create Wallet
          </Text>
          <TouchableOpacity
            onPress={() => handleCreateWallet("bitcoin")}
            style={styles.walletOption}
          >
            <Icon name="bitcoin" size={24} color={colors.primary} />
            <Text style={[styles.walletOptionText, { color: colors.text }]}>
              Bitcoin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCreateWallet("litecoin")}
            style={styles.walletOption}
          >
            <Icon name="litecoin" size={24} color={colors.primary} />
            <Text style={[styles.walletOptionText, { color: colors.text }]}>
              Litecoin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCreateWallet("lightning")}
            style={styles.walletOption}
          >
            <Icon name="flash" size={24} color={colors.primary} />
            <Text style={[styles.walletOptionText, { color: colors.text }]}>
              Lightning
            </Text>
          </TouchableOpacity>
          <Button
            title="Cancel"
            onPress={() => setIsWalletModalVisible(false)}
            style={styles.modalButton}
          />
        </View>
      </Modal>
      {wallets.map((wallet) => (
        <View key={wallet.type} style={styles.walletItem}>
          <Icon
            name={
              wallet.type === "bitcoin"
                ? "bitcoin"
                : wallet.type === "lightning"
                ? "flash"
                : "litecoin"
            }
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.walletText, { color: colors.text }]}>
            {wallet.type.toUpperCase()} Wallet
          </Text>
          <Text style={[styles.addressText, { color: colors.text }]}>
            Public Key: {wallet.publicKey}
          </Text>
        </View>
      ))}
      <TouchableOpacity
        onPress={() => setIsWalletModalVisible(true)}
        style={styles.addWalletButton}
      >
        <Icon name="plus" size={24} color={colors.primary} />
        <Text style={[styles.addWalletText, { color: colors.text }]}>
          Add Wallet
        </Text>
      </TouchableOpacity>
      <Button
        title="Remove Account"
        onPress={() =>
          Alert.alert("Not implemented", "This feature is not yet implemented.")
        }
        style={styles.button}
        icon="account-remove"
      />
      <Button
        title="Reset Password"
        onPress={() =>
          Alert.alert("Not implemented", "This feature is not yet implemented.")
        }
        style={styles.button}
        icon="lock-reset"
      />
      <Button
        title="Privacy Settings"
        onPress={() =>
          Alert.alert("Not implemented", "This feature is not yet implemented.")
        }
        style={styles.button}
        icon="shield-lock"
      />

      {wallets.map((wallet) => (
        <View key={wallet.type} style={styles.walletItem}>
          <Icon
            name={
              wallet.type === "bitcoin"
                ? "bitcoin"
                : wallet.type === "lightning"
                ? "flash"
                : "litecoin"
            }
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.walletText, { color: colors.text }]}>
            {wallet.type.toUpperCase()} Wallet
          </Text>
          <Text style={[styles.addressText, { color: colors.text }]}>
            Public Key: {wallet.publicKey}
          </Text>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={importModalVisible}
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Import Wallet
          </Text>
          <Input
            placeholder="Enter mnemonic phrase"
            value={importMnemonic}
            onChangeText={setImportMnemonic}
            multiline
          />
          <Button
            title="Import"
            onPress={handleImportWallet}
            style={styles.modalButton}
          />
          <Button
            title="Cancel"
            onPress={() => setImportModalVisible(false)}
            style={styles.modalButton}
          />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={accountDetailsModalVisible}
        onRequestClose={() => setAccountDetailsModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Account Details
          </Text>
          <Input
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title="Show Details"
            onPress={handleShowAccountDetails}
            style={styles.modalButton}
          />
          <Button
            title="Cancel"
            onPress={() => setAccountDetailsModalVisible(false)}
            style={styles.modalButton}
          />
        </View>
      </Modal>

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

      {/* <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: colors.text }]}>Enable Taproot</Text>
        <Switch 
          value={enableTaproot} 
          onValueChange={setEnableTaproot}
          trackColor={{ false: colors.accent, true: colors.primary }}
          thumbColor={enableTaproot ? colors.background : colors.text}
        />
      </View> */}
    </ScrollView>
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
  tileContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: tileSize,
    height: tileSize,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
