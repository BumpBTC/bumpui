import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import api from '../services/api';
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import Button from "../components/Button";
import Input from "../components/Input";
import ContactList from "../components/ContactList";
import QRCode from "react-native-qrcode-svg";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DropDownPicker from "react-native-dropdown-picker";

const LightningScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const {
    createLightningWallet,
    createLightningChannel,
    importLightningWallet,
    createLightningInvoice,
    payLightningInvoice,
    openLightningChannel,
    closeLightningChannel,
    getLightningBalance,
    getLightningTransactionHistory,
    getChannelConfigurations,
    updateChannelConfiguration,
    deleteChannelConfiguration,
  } = useContext(WalletContext);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [paymentRequest, setPaymentRequest] = useState("");
  const [nodeUri, setNodeUri] = useState("");
  const [channelId, setChannelId] = useState("");
  const [invoice, setInvoice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [channelConfigurations, setChannelConfigurations] = useState([]);
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);
  const [channelCreationProgress, setChannelCreationProgress] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContacts();
    if (route.params?.contact) {
      const { contact } = route.params;
      setSelectedContact(contact);
      setNodeUri(contact.lightningPublicKey);
    }
    loadChannelConfigurations();
  }, [route.params, fetchContacts]);

  const loadChannelConfigurations = async () => {
    const configs = await getChannelConfigurations();
    setChannelConfigurations(configs);
  };

  const showModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const fetchContacts = useCallback(async () => {
    try {
      const response = await api.get("/contacts");
      setContacts(response.data.filter((contact) => contact.lightningPublicKey));
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  }, []);

  const handleCreateWallet = async () => {
    try {
      await createLightningWallet();
      Alert.alert("Success", "Lightning wallet created successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCreateChannel = async () => {
    if (!nodeUri || !amount || !channelName) {
      Alert.alert("Error", "Please enter both Node URI and amount");
      return;
    }
    setIsLoading(true);
    try {
      const channel = await createLightningChannel(
        nodeUri,
        parseInt(amount),
        channelName
      );
      Alert.alert("Success", `Channel created with ID: ${channel.channelId}`);
      await loadChannelConfigurations();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create channel");
    } finally {
      setIsLoading(false);
      setChannelCreationProgress(0);
    }
  };

  const handleSelectConfiguration = (config) => {
    setSelectedConfiguration(config);
    setChannelName(config.name);
    setAmount(config.amount.toString());
    setNodeUri(config.nodeUri);
  };

  const handleUpdateConfiguration = async () => {
    if (selectedConfiguration) {
      await updateChannelConfiguration(selectedConfiguration._id, {
        name: channelName,
        amount: parseInt(amount),
        nodeUri,
      });
      await loadChannelConfigurations();
      Alert.alert("Success", "Configuration updated");
    }
  };

  const handleDeleteConfiguration = async () => {
    if (selectedConfiguration) {
      await deleteChannelConfiguration(selectedConfiguration._id);
      await loadChannelConfigurations();
      setSelectedConfiguration(null);
      setChannelName("");
      setAmount("");
      setNodeUri("");
      Alert.alert("Success", "Configuration deleted");
    }
  };

  const renderChannelCreationProgress = () => {
    if (channelCreationProgress > 0 && channelCreationProgress < 100) {
      return (
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: colors.text }]}>
            Creating channel: {channelCreationProgress}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${channelCreationProgress}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>
      );
    }
    return null;
  };

  const handleContactPress = (contact) => {
    setSelectedContact(contact);
    setNodeUri(contact.lightningPublicKey);
  };

  const handleImportWallet = async () => {
    showModal(
      <View>
        <Input
          placeholder="Enter mnemonic"
          onChangeText={(text) => setMemo(text)}
        />
        <Button
          title="Import"
          onPress={async () => {
            try {
              await importLightningWallet(memo);
              Alert.alert("Success", "Lightning wallet imported successfully");
              setModalVisible(false);
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          }}
        />
      </View>
    );
  };

  const handleCreateInvoice = useCallback(async () => {
    if (!amount || !memo) {
      Alert.alert("Error", "Please enter both amount and memo");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const result = await createLightningInvoice(parseInt(amount), memo);
      setInvoice(result.paymentRequest);
      showModal(
        <View style={styles.qrCodeContainer}>
          <QRCode
            value={result.paymentRequest}
            size={200}
            color={colors.text}
            backgroundColor={colors.background}
          />
          <Text style={[styles.invoice, { color: colors.text }]}>
            {result.paymentRequest}
          </Text>
        </View>
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  }, [amount, memo, createLightningInvoice, colors, showModal]);

  const handlePayInvoice = useCallback(async () => {
    if (!paymentRequest) {
      Alert.alert("Error", "Please enter a Lightning invoice");
      return;
    }
  
    setIsLoading(true);
    try {
      await payLightningInvoice(paymentRequest);
      Alert.alert("Success", "Payment sent successfully");
      setPaymentRequest("");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send payment");
    } finally {
      setIsLoading(false);
    }
  }, [paymentRequest, payLightningInvoice]);

  const handleOpenChannel = async () => {
    try {
      setShowModal(true);
      await openLightningChannel(nodeUri, amount);
      Alert.alert("Success", "Channel opened successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCloseChannel = async () => {
    if (!channelId) {
      Alert.alert("Error", "Please enter a channel ID");
      return;
    }
    setIsLoading(true);
    try {
      await closeLightningChannel(channelId);
      Alert.alert("Success", "Channel closed successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to close channel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetBalance = async () => {
    setIsLoading(true);
    try {
      const balance = await getLightningBalance();
      Alert.alert(
        "Balance",
        `Your current Lightning balance is ${balance} sats`
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to get balance");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTransactionHistory = async () => {
    setIsLoading(true);
    try {
      const history = await getLightningTransactionHistory();
      // You might want to display this history in a more user-friendly way
      console.log(history);
      Alert.alert(
        "Success",
        "Transaction history retrieved. Check console for details."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to get transaction history"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Animatable.View animation="fadeIn" duration={1000}>
          {/* <Animatable.View animation="fadeIn">
            <Text style={[styles.title, { color: colors.text }]}>
              Lightning Network
            </Text>
            <Input
              label="Lightning Invoice"
              value={invoice}
              onChangeText={setInvoice}
              placeholder="Enter Lightning invoice"
            />
            <Input
              label="Payment Request"
              value={paymentRequest}
              onChangeText={setPaymentRequest}
              placeholder="Enter Lightning invoice"
            />
            <Button
              title="Pay Invoice"
              onPress={handlePayInvoice}
              loading={isLoading}
              style={styles.button}
            />
            <>
              <br />
              <br />
            </>
            <Input
              label="Amount (sats)"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount in satoshis"
              keyboardType="numeric"
            />

            <Input
              label="Memo"
              value={memo}
              onChangeText={setMemo}
              placeholder="Enter memo for invoice"
            />
            <Button
              title="Create Invoice"
              onPress={handleCreateInvoice}
              loading={isLoading}
              style={styles.button}
            />
          </Animatable.View> */}

          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={styles.gridButton}
              onPress={handleGetBalance}
            >
              <Icon name="wallet" size={24} color={colors.primary} />
              <Text style={[styles.gridButtonText, { color: colors.text }]}>
                Get Balance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridButton}
              onPress={() =>
                showModal(
                  <View>
                    <DropDownPicker
                      open={dropdownOpen}
                      value={
                        selectedConfiguration ? selectedConfiguration._id : null
                      }
                      items={channelConfigurations.map((config) => ({
                        label: config.name,
                        value: config._id,
                      }))}
                      setOpen={setDropdownOpen}
                      setValue={(callback) => {
                        const selectedId = callback(
                          selectedConfiguration
                            ? selectedConfiguration._id
                            : null
                        );
                        const selected = channelConfigurations.find(
                          (config) => config._id === selectedId
                        );
                        handleSelectConfiguration(selected);
                      }}
                      style={styles.dropdown}
                      dropDownStyle={{ backgroundColor: colors.background }}
                    />

                    <Input
                      label="Channel Name"
                      value={channelName}
                      onChangeText={setChannelName}
                      placeholder="Enter a name for your channel"
                    />
                    <Input
                      label="Node URI (optional)"
                      value={nodeUri}
                      onChangeText={setNodeUri}
                    />
                    <Input
                      label="Amount (sats)"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                    />

                    {renderChannelCreationProgress()}

                    <Button
                      title="Create/Update Channel"
                      onPress={
                        selectedConfiguration
                          ? handleUpdateConfiguration
                          : handleCreateChannel
                      }
                    />
                    {selectedConfiguration && (
                      <Button
                        title="Delete Configuration"
                        onPress={handleDeleteConfiguration}
                        style={styles.deleteButton}
                      />
                    )}
                  </View>
                )
              }
            >
              {/* <Icon name="wallet-plus" size={24} color={colors.primary} /> */}
              <Icon name="connection" size={24} color={colors.primary} />
              <Text style={[styles.gridButtonText, { color: colors.text }]}>
                Create Channel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridButton}
              onPress={handleImportWallet}
            >
              <Icon name="wallet-outline" size={24} color={colors.primary} />
              <Text style={[styles.gridButtonText, { color: colors.text }]}>
                Import Wallet
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridButton}
              onPress={() =>
                showModal(
                  <View>
                    <Input
                      label="Amount (sats)"
                      value={amount}
                      onChangeText={setAmount}
                      placeholder="Enter amount in satoshis"
                      keyboardType="numeric"
                    />
                    <Input
                      label="Memo"
                      value={memo}
                      onChangeText={setMemo}
                      placeholder="Enter memo for invoice"
                    />
                    <Button
                      title="Create Invoice"
                      onPress={handleCreateInvoice}
                      loading={isLoading}
                      style={styles.button}
                    />
                  </View>
                )
              }
            >
              <Icon name="qrcode" size={24} color={colors.primary} />
              <Text style={[styles.gridButtonText, { color: colors.text }]}>
                Create Invoice
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridButton}
              onPress={() =>
                showModal(
                  <View>
                    <Input
                      label="Payment Request"
                      value={paymentRequest}
                      onChangeText={setPaymentRequest}
                    />
                    <Button title="Pay Invoice" onPress={handlePayInvoice} />
                  </View>
                )
              }
            >
              <Icon name="send" size={24} color={colors.primary} />
              <Text style={[styles.gridButtonText, { color: colors.text }]}>
                Pay Invoice
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridButton}
              onPress={() =>
                showModal(
                  <View>
                    <Input
                      label="Node URI"
                      value={nodeUri}
                      onChangeText={setNodeUri}
                    />
                    <Input
                      label="Amount (sats)"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                    />
                    <Button title="Open Channel" onPress={handleOpenChannel} />
                    <ContactList
                      contacts={contacts}
                      onContactPress={handleContactPress}
                      selectedContact={selectedContact}
                    />
                    <Modal
                      visible={showModal}
                      transparent={true}
                      animationType="slide"
                    >
                      <View style={styles.modalContainer}>
                        <View
                          style={[
                            styles.modalContent,
                            { backgroundColor: colors.card },
                          ]}
                        >
                          <Text
                            style={[styles.modalText, { color: colors.text }]}
                          >
                            Opening channel...
                          </Text>
                          <Button
                            title="Close"
                            onPress={() => setShowModal(false)}
                          />
                        </View>
                      </View>
                    </Modal>
                  </View>
                )
              }
            >
              <Icon name="connection" size={24} color={colors.primary} />
              <Text style={[styles.gridButtonText, { color: colors.text }]}>
                Open Channel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridButton}
              onPress={() =>
                showModal(
                  <View>
                    <Input
                      label="Channel ID"
                      value={channelId}
                      onChangeText={setChannelId}
                    />
                    <Button
                      title="Close Channel"
                      onPress={handleCloseChannel}
                    />
                  </View>
                )
              }
            >
              <Icon name="close-network" size={24} color={colors.primary} />
              <Text style={[styles.gridButtonText, { color: colors.text }]}>
                Close Channel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridButton}
              onPress={handleGetTransactionHistory}
            >
              <Icon name="history" size={24} color={colors.primary} />
              <Text style={[styles.gridButtonText, { color: colors.text }]}>
                Transaction History
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={[styles.modalView, { backgroundColor: colors.background }]}
          >
            <ScrollView>{modalContent}</ScrollView>
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    marginVertical: 10,
  },
  dropdown: {
    marginBottom: 20,
  },
  gridButton: {
    width: "48%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 15,
  },
  gridButtonText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
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
    maxHeight: "80%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
  },
  qrCodeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  invoice: {
    marginTop: 10,
    fontSize: 12,
    textAlign: "center",
  },
  progressContainer: {
    marginVertical: 10,
  },
  progressText: {
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  openButton: {
    marginVertical: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    marginTop: 10,
  },
});

export default React.memo(LightningScreen);
