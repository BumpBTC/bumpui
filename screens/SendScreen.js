import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  Animated,
  Text,
  Keyboard,
} from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { WalletContext } from "../contexts/WalletContext";
import api from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import ContactList from "../components/ContactList";
import * as Animatable from "react-native-animatable";
import CurrencySelector from "../components/CurrencySelector";
import ConfirmationModal from "../components/ConfirmationModal";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SendScreen = ({ navigation, route }) => {
  const [address, setAddress] = useState("");
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [lightningInvoice, setLightningInvoice] = useState("");
  const [litecoinAddress, setLitecoinAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [isUsd, setIsUsd] = useState(false);
  const [paymentType, setPaymentType] = useState("bitcoin");
  const { clientKeyShare } = useContext(WalletContext);
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isRBF, setIsRBF] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedCrypto, setSelectedCrypto, exchangeRates, convertAmount } =
    useContext(WalletContext);

  const buttonScale = new Animated.Value(1);

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
    fetchContacts();
    if (route.params?.contact) {
      const { contact, network } = route.params;
      setSelectedContact(contact);
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
    if (!address || (!amount && !usdAmount)) {
      Alert.alert("Error", "Please fill in all fields");
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
    try {
      let response;
      switch (selectedCrypto) {
        case "bitcoin":
          response = await api.post("/wallet/send-bitcoin", {
            toAddress: address,
            amount: parseFloat(amount),
            isRBF,
          });
          break;
        case "lightning":
          response = await api.post("/wallet/send-lightning", {
            paymentRequest: address,
            amount: parseFloat(amount),
          });
          break;
        case "litecoin":
          response = await api.post("/wallet/send-litecoin", {
            toAddress: address,
            amount: parseFloat(amount),
          });
          break;
        default:
          throw new Error("Unsupported cryptocurrency");
      }
      setIsLoading(false);
      setShowConfirmation(false);
      navigation.navigate("TransactionStatus", {
        status: "success",
        txid: response.data.txid,
      });
    } catch (error) {
      setIsLoading(false);
      setShowConfirmation(false);
      Alert.alert("Error", error.message || "Failed to send transaction");
    }
  };

  const handleContactPress = (contact) => {
    setSelectedContact(contact);
    setAddress(contact[`${selectedCrypto}Address`] || "");
    setBitcoinAddress(contact.bitcoinAddress || "");
    setLightningInvoice(contact.lightningPublicKey || "");
    setLitecoinAddress(contact.litecoinAddress || "");
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CurrencySelector
          selectedCrypto={selectedCrypto}
          onSelect={() => {
            const cryptos = ["bitcoin", "lightning", "litecoin"];
            const currentIndex = cryptos.indexOf(selectedCrypto);
            const nextIndex = (currentIndex + 1) % cryptos.length;
            setSelectedCrypto(cryptos[nextIndex]);
          }}
        />
        <Animatable.View animation="fadeInUp" delay={300}>
        <View style={styles.amountContainer}>
            <Input
              label="Amount"
              value={isUsd ? usdAmount : amount}
              onChangeText={(value) => isUsd ? setUsdAmount(value) : setAmount(value)}
              placeholder={`Enter amount in ${isUsd ? 'USD' : selectedCrypto}`}
              keyboardType="numeric"
            />
            <Switch
              value={isUsd}
              onValueChange={setIsUsd}
              trackColor={{ false: colors.accent, true: colors.primary }}
              thumbColor={isUsd ? colors.background : colors.text}
            />
            <Text style={[styles.usdLabel, { color: colors.text }]}>{isUsd ? 'USD' : selectedCrypto.toUpperCase()}</Text>
          </View>
          {selectedCrypto === "bitcoin" && (
            <>
              <Input
                label="Bitcoin Address"
                value={bitcoinAddress}
                onChangeText={setBitcoinAddress}
                placeholder="Enter Bitcoin address"
              />
              <View style={styles.rbfContainer}>
                <Text style={[styles.rbfLabel, { color: colors.text }]}>
                  Enable RBF
                </Text>
                <Switch
                  value={isRBF}
                  onValueChange={setIsRBF}
                  trackColor={{ false: colors.accent, true: colors.primary }}
                  thumbColor={isRBF ? colors.background : colors.text}
                />
              </View>
            </>
          )}
          {selectedCrypto === "lightning" && (
            <Input
              label="Lightning Invoice"
              value={lightningInvoice}
              onChangeText={setLightningInvoice}
              placeholder="Enter Lightning invoice"
            />
          )}
          {selectedCrypto === "litecoin" && (
            <Input
              label="Litecoin Address"
              value={litecoinAddress}
              onChangeText={setLitecoinAddress}
              placeholder="Enter Litecoin address"
            />
          )}
        </Animatable.View>

        <Animated.View
          style={[
            styles.sendButtonContainer,
            { transform: [{ scale: buttonScale }] },
          ]}
        >
          <Button
            title="Send"
            onPress={handleSend}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            loading={isLoading}
            icon={
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={colors.background}
              />
            }
          />
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
          recipient: getSelectedAddress(),
          amount: isUsd ? usdAmount : amount,
          currency: isUsd ? "USD" : selectedCrypto,
          networkCost: "0.0001", // This should be dynamically calculated
          total: (parseFloat(isUsd ? usdAmount : amount) + 0.0001).toFixed(
            isUsd ? 2 : 8
          ),
        }}
      />
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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
  sendButton: {
    marginVertical: 20,
  },
  content: {
    padding: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  usdLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  rbfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rbfLabel: {
    fontSize: 16,
  },
  sendButtonContainer: {
    marginTop: 20,
  },
});

export default SendScreen;
