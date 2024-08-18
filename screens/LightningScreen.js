import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import Button from "../components/Button";
import Input from "../components/Input";
import QRCode from "react-native-qrcode-svg";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const LightningScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const {
    createLightningWallet,
    importLightningWallet,
    createLightningInvoice,
    payLightningInvoice,
    openLightningChannel,
    closeLightningChannel,
  } = useContext(WalletContext);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [paymentRequest, setPaymentRequest] = useState("");
  const [nodeUri, setNodeUri] = useState("");
  const [channelId, setChannelId] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const showModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const handleCreateWallet = async () => {
    try {
      await createLightningWallet();
      Alert.alert("Success", "Lightning wallet created successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
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
    if (!amount) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    setIsLoading(true);

    try {
      const newInvoice = await createLightningInvoice(parseFloat(amount));
      const result = await createLightningInvoice(amount, memo);
      setInvoice(result.payment_request);
      Alert.alert("Invoice Created", newInvoice);
      setAmount("");
      showModal(
        <View style={styles.qrCodeContainer}>
          <QRCode
            value={result.payment_request}
            size={200}
            color={colors.text}
            backgroundColor={colors.background}
          />
          <Text style={[styles.invoice, { color: colors.text }]}>
            {result.payment_request}
          </Text>
        </View>
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  }, [amount, createLightningInvoice]);

  const handlePayInvoice = useCallback(async () => {
    if (!invoice) {
      Alert.alert("Error", "Please enter a Lightning invoice");
      return;
    }

    setIsLoading(true);
    try {
      await payLightningInvoice(invoice);
      Alert.alert("Success", "Payment sent successfully");
      setInvoice("");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send payment");
    } finally {
      setIsLoading(false);
    }
  }, [invoice, payLightningInvoice]);

  const handleOpenChannel = async () => {
    try {
      await openLightningChannel(nodeUri, amount);
      Alert.alert("Success", "Channel opened successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCloseChannel = async () => {
    try {
      await closeLightningChannel(channelId);
      Alert.alert("Success", "Channel closed successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Animatable.View animation="fadeIn" duration={1000}>

          <Animatable.View animation="fadeIn">
          <Text style={[styles.title, { color: colors.text }]}>Lightning Network</Text>
          <Input
            label="Lightning Invoice"
            value={invoice}
            onChangeText={setInvoice}
            placeholder="Enter Lightning invoice"
          />
          <Button 
            title="Pay Invoice" 
            onPress={handlePayInvoice} 
            loading={isLoading}
            style={styles.button}
          />
          <Input
            label="Amount (sats)"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount in satoshis"
            keyboardType="numeric"
          />
          <Button 
            title="Create Invoice" 
            onPress={handleCreateInvoice} 
            loading={isLoading}
            style={styles.button}
          />
        </Animatable.View>

          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={styles.gridButton}
              onPress={handleCreateWallet}
            >
              <Icon name="wallet-plus" size={24} color={colors.primary} />
              <Text style={[styles.gridButtonText, { color: colors.text }]}>
                Create Wallet
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
                      keyboardType="numeric"
                    />
                    <Input label="Memo" value={memo} onChangeText={setMemo} />
                    <Button
                      title="Create Invoice"
                      onPress={handleCreateInvoice}
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
  content: {
    padding: 20,
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
});

export default React.memo(LightningScreen);