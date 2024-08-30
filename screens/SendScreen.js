import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  Animated,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import api from "../services/api";
import ContactList from "../components/ContactList";
import * as Animatable from "react-native-animatable";
import CurrencySelector from "../components/CurrencySelector";
import ConfirmationModal from "../components/ConfirmationModal";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Camera } from "expo-camera";
import Slider from "@react-native-community/slider";

const SendScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [address, setAddress] = useState("");
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [lightningInvoice, setLightningInvoice] = useState("");
  const [litecoinAddress, setLitecoinAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [isUsd, setIsUsd] = useState(false);
  const [paymentType, setPaymentType] = useState("bitcoin");
  const { clientKeyShare } = useContext(WalletContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [networkFee, setNetworkFee] = useState(0.0001); // Default fee
  const [priority, setPriority] = useState("medium"); // Default priority
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isRBF, setIsRBF] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {
    selectedCrypto,
    setSelectedCrypto,
    exchangeRates,
    convertAmount,
    wallets,
  } = useContext(WalletContext);
  const isWeb = Platform.OS === "web";

  const buttonScale = new Animated.Value(1);
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const backgroundAnimation = useRef(null);

  const getThemeColor = () => {
    switch (selectedCrypto) {
      case "bitcoin":
        return "#F7931A";
      case "lightning":
        return "#792DE4";
      case "litecoin":
        return "#345D9D";
      default:
        return colors.primary;
    }
  };

  const convertToUSD = (cryptoAmount) => {
    const rate = exchangeRates[selectedCrypto]?.usd || 1;
    return (parseFloat(cryptoAmount) * rate).toFixed(2);
  };

  const convertFromUSD = (usdAmount) => {
    const rate = exchangeRates[selectedCrypto]?.usd || 1;
    return (parseFloat(usdAmount) / rate).toFixed(8);
  };

  useEffect(() => {
    if (!isWeb) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }
  }, []);

  useEffect(() => {
    fetchContacts();
    if (route.params?.contact) {
      const { contact, network } = route.params;
      setSelectedContact(contact);
      setAddress(contact[`${selectedCrypto}Address`] || "");
      switch (network) {
        case "bitcoin":
          setBitcoinAddress(contact.bitcoinAddress || "");
          break;
        case "lightning":
          setLightningInvoice(contact.lightningPublicKey || "");
          break;
        case "litecoin":
          setLitecoinAddress(contact.litecoinAddress || "");
          break;
      }
    }
    if (isUsd) {
      setAmount(convertAmount(usdAmount, "USD", selectedCrypto).toFixed(8));
    } else {
      setUsdAmount(convertAmount(amount, selectedCrypto, "USD").toFixed(2));
    }
  }, [route.params, isUsd, amount, usdAmount, selectedCrypto, convertAmount]);

  useEffect(() => {
    if (amount && !isNaN(amount)) {
      setUsdAmount(convertAmount(amount, selectedCrypto, "USD").toFixed(2));
    } else {
      setUsdAmount("0");
    }
  }, [amount, selectedCrypto, convertAmount]);

  const fetchContacts = async () => {
    try {
      const response = await api.get("/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      Alert.alert("Error", "Failed to fetch contacts");
    }
  };

  const getSelectedAddress = () => {
    switch (selectedCrypto) {
      case "bitcoin":
        return bitcoinAddress;
      case "lightning":
        return lightningInvoice;
      case "litecoin":
        return litecoinAddress;
      default:
        return "";
    }
  };

  const handleSend = () => {
    if (!address || !amount || isNaN(amount)) {
      Alert.alert("Error", "Please fill in all fields with valid values");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSend = async () => {
    // setIsLoading(true);
    // try {
    //   const response = await sendTransaction(
    //     selectedCrypto,
    //     address,
    //     bitcoinAddress,
    //     isUsd ? usdAmount : amount,
    //     isRBF
    //   );
    //   setIsLoading(false);
    //   setShowConfirmation(false);
    //   navigation.navigate("TransactionStatus", {
    //     status: "success",
    //     txid: response.txid,
    //   });
    setIsLoading(true);
    backgroundAnimation.current.play();
    try {
      // Simulate sending for all currencies
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsLoading(false);
      setShowConfirmation(false);
      Alert.alert(
        "Success",
        `You sent ${amount} ${selectedCrypto.toUpperCase()} to ${address}`
      );
      setAmount("");
      setAddress("");
    } catch (error) {
      setIsLoading(false);
      setShowConfirmation(false);
      Alert.alert("Error", error.message || "Failed to send transaction");
    }
  };
  // try {
  //   let response;
  //   switch (selectedCrypto) {
  //     case "bitcoin":
  //       response = await api.post("/wallet/send-bitcoin", {
  //         toAddress: address,
  //         amount: parseFloat(amount),
  //         isRBF,
  //       });
  //       break;
  //     case "lightning":
  //       response = await api.post("/wallet/send-lightning", {
  //         paymentRequest: address,
  //         amount: parseFloat(amount),
  //       });
  //       break;
  //     case "litecoin":
  //       response = await api.post("/wallet/send-litecoin", {
  //         toAddress: address,
  //         amount: parseFloat(amount),
  //       });
  //       break;
  //     default:
  //       throw new Error("Unsupported cryptocurrency");
  //   }
  //   setIsLoading(false);
  //   setShowConfirmation(false);
  //   navigation.navigate("TransactionStatus", {
  //     status: "success",
  //     txid: response.data.txid,
  //   });
  // } catch (error) {
  //   setIsLoading(false);
  //   setShowConfirmation(false);
  //   Alert.alert("Error", error.message || "Failed to send transaction");
  // }

  const handleContactPress = (contact) => {
    setSelectedContact(contact);
    setAddress(contact[`${selectedCrypto}Address`] || "");
    setBitcoinAddress(contact.bitcoinAddress || "");
    setLightningInvoice(contact.lightningPublicKey || "");
    setLitecoinAddress(contact.litecoinAddress || "");
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getCurrencySymbol = () => {
    switch (selectedCrypto) {
      case "bitcoin":
        return "₿";
      case "lightning":
        return "⚡";
      case "litecoin":
        return "Ł";
      default:
        return "$";
    }
  };

  const getAmountPlaceholder = () => {
    switch (selectedCrypto) {
      case "bitcoin":
        return "Enter amount in BTC";
      case "lightning":
        return "Enter amount in SATS";
      case "litecoin":
        return "Enter amount in LTC";
      default:
        return "Enter amount";
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setAddress(data);
    setShowScanner(false);
    // You might want to add a small delay before allowing another scan
    setTimeout(() => setScanned(false), 1000);
  };

  const renderQRScanner = () => {
    if (isWeb) {
      return (
        <View style={styles.webScannerMessage}>
          <Text style={styles.webScannerText}>
            QR code scanning is only available on mobile devices.
          </Text>
          <Button title="Close" onPress={() => setShowScanner(false)} />
        </View>
      );
    }

    return (
      <View style={StyleSheet.absoluteFillObject}>
        <Camera
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={handleBarCodeScanned}
        >
          <View style={styles.scannerOverlay}>
            <TouchableOpacity
              style={styles.closeScannerButton}
              onPress={() => setShowScanner(false)}
            >
              <Text style={styles.closeScannerButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  };

  const renderNetworkFeeSelector = () => (
    <View style={styles.networkFeeContainer}>
      <Text style={[styles.networkFeeLabel, { color: colors.text }]}>
        Network Fee:
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0.00001}
        maximumValue={0.001}
        step={0.00001}
        value={networkFee}
        onValueChange={setNetworkFee}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />
      <Text style={[styles.networkFeeValue, { color: colors.text }]}>
        {networkFee.toFixed(5)} BTC
      </Text>
    </View>
  );

  const renderPrioritySelector = () => (
    <View style={styles.priorityContainer}>
      <Text style={[styles.priorityLabel, { color: colors.text }]}>
        Priority:
      </Text>
      <View style={styles.priorityButtons}>
        {["low", "medium", "high"].map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityButton,
              priority === p && styles.activePriorityButton,
              { borderColor: colors.border },
            ]}
            onPress={() => setPriority(p)}
          >
            <Text
              style={[
                styles.priorityButtonText,
                priority === p && styles.activePriorityButtonText,
                { color: priority === p ? colors.background : colors.text },
              ]}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.currencySelectorContainer}>
          <CurrencySelector
            selectedCrypto={selectedCrypto}
            onSelect={(crypto) => setSelectedCrypto(crypto)}
          />
        </View>
        <Animatable.Text
          animation="fadeInDown"
          style={[styles.title, { color: colors.text }]}
        >
          Send{" "}
          {selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)}
        </Animatable.Text>
        <Animatable.Text
          animation="fadeInUp"
          delay={300}
          style={[styles.subtitle, { color: colors.text }]}
        >
          Enter address and amount to send {selectedCrypto}!
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={300}>
          <View style={styles.addressContainer}>
            <Input
              label="Recipient Address"
              value={address}
              onChangeText={setAddress}
              placeholder={`Enter ${selectedCrypto} address`}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                if (isWeb) {
                  Alert.alert(
                    "Web Environment",
                    "QR code scanning is only available on mobile devices."
                  );
                } else {
                  setShowScanner(true);
                  {
                    renderQRScanner();
                  }
                }
              }}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.amountContainer}>
            <Input
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder={getAmountPlaceholder()}
              keyboardType="numeric"
            />
            <Text style={[styles.currencySymbol, { color: colors.text }]}>
              {getCurrencySymbol()}
            </Text>
          </View>
          <Text style={[styles.usdAmount, { color: colors.text }]}>
            ≈ ${usdAmount} USD
          </Text>
        </Animatable.View>

        {renderNetworkFeeSelector()}
        {renderPrioritySelector()}

        <Animated.View
          style={[
            styles.sendButtonContainer,
            {
              transform: [{ scale: buttonScale }],
              opacity: buttonOpacity,
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleSend}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.sendButtonText}>Send</Text>
            <MaterialCommunityIcons
              name="send"
              size={24}
              color={colors.background}
            />
          </TouchableOpacity>
        </Animated.View>

        <ContactList
          contacts={contacts}
          onContactPress={handleContactPress}
          selectedContact={selectedContact}
        />
      </ScrollView>

      <ConfirmationModal
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmSend}
        details={{
          recipient: address,
          amount: amount,
          currency: selectedCrypto,
          networkFee: networkFee.toFixed(8),
          priority: priority,
          total: (parseFloat(amount) + parseFloat(networkFee)).toFixed(8),
        }}
        navigation={navigation}
      />

      <LottieView
        ref={backgroundAnimation}
        source={require("../assets/success-animation.json")}
        style={styles.backgroundAnimation}
      />

      {/* {renderQRScanner()} */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  webScannerMessage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  webScannerText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  typeButton: {
    width: "48%",
  },
  activeButton: {
    opacity: 0.8,
  },
  activeButtonText: {
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  currencySelectorContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  currencySymbol: {
    fontSize: 24,
    marginLeft: 10,
  },
  usdAmount: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "right",
  },
  sendButtonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  backgroundAnimation: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  usdLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  rbfContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rbfLabel: {
    fontSize: 16,
  },
  scannerContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  closeScannerButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    borderRadius: 5,
  },
  closeScannerButtonText: {
    color: "white",
    fontSize: 16,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanButton: {
    marginLeft: 10,
    padding: 10,
  },
  networkFeeContainer: {
    marginVertical: 20,
  },
  networkFeeLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  networkFeeValue: {
    fontSize: 14,
    textAlign: "right",
  },
  priorityContainer: {
    marginBottom: 20,
  },
  priorityLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  priorityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activePriorityButton: {
    backgroundColor: "#4169E1",
  },
  priorityButtonText: {
    fontSize: 14,
  },
  activePriorityButtonText: {
    fontWeight: "bold",
  },
});

export default SendScreen;
