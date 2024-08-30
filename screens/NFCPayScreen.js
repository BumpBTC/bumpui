import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
} from "react-native";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import { Svg, Path } from "react-native-svg";
import LottieView from "lottie-react-native";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const NFCPayScreen = ({ navigation }) => {
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [nfcChannelBalance, setNfcChannelBalance] = useState(0);
  const [mode, setMode] = useState("send");
  const { colors } = useTheme();
  const [displayCurrency, setDisplayCurrency] = useState("USD");
  const [displayAmount, setDisplayAmount] = useState({USD: "0", BTC: "0", SATS: "0"});

  const {
    exchangeRates,
    createNfcInvoice,
    payNfcInvoice,
    getNfcChannelBalance,
  } = useContext(WalletContext);

  const nfcAnimation = useRef(null);
  const buttonScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isProcessing) {
      nfcAnimation.current?.play();
    } else {
      nfcAnimation.current?.reset();
    }
  }, [isProcessing]);

  useEffect(() => {
    const checkNfcSupport = async () => {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setIsNfcSupported(true);
      }
    };
    checkNfcSupport();
    fetchNfcChannelBalance();

    return () => NfcManager.cancelTechnologyRequest().catch(() => 0);
  }, []);

  const fetchNfcChannelBalance = async () => {
    try {
      const balance = await getNfcChannelBalance();
      setNfcChannelBalance(balance);
    } catch (error) {
      console.error("Failed to fetch NFC channel balance:", error);
    }
  };

  const updateDisplayAmount = (value, fromCurrency) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setDisplayAmount("0");
      return;
    }

    let btcAmount = 0;
    if (fromCurrency === "USD") {
      btcAmount = numValue / exchangeRates.bitcoin.usd;
    } else if (fromCurrency === "BTC") {
      btcAmount = numValue;
    } else if (fromCurrency === "SATS") {
      btcAmount = numValue / 100000000;
    }

    switch (displayCurrency) {
      case "USD":
        setDisplayAmount((btcAmount * exchangeRates.bitcoin.usd).toFixed(2));
        break;
      case "BTC":
        setDisplayAmount(btcAmount.toFixed(8));
        break;
      case "SATS":
        setDisplayAmount((btcAmount * 100000000).toFixed(0));
        break;
    }
  };

  const switchDisplayCurrency = () => {
    setDisplayCurrency((prev) => {
      if (prev === "USD") return "BTC";
      if (prev === "BTC") return "SATS";
      return "USD";
    });
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setDisplayAmount({USD: "0", BTC: "0", SATS: "0"});
      return;
    }
    const btcAmount = numValue / exchangeRates.bitcoin.usd;
    const satsAmount = btcAmount * 100000000;
    setDisplayAmount({
      USD: numValue.toFixed(2),
      BTC: btcAmount.toFixed(8),
      SATS: satsAmount.toFixed(0)
    });
  };


  const handleNfcPayment = useCallback(async () => {
    if (!isNfcSupported) {
      Alert.alert("Error", "NFC is not supported on this device");
      return;
    }

    setIsProcessing(true);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      if (mode === "send") {
        const invoice = await createNfcInvoice(
          parseFloat(amount),
          "NFC Payment"
        );
        const ndef = Ndef.encodeMessage([
          Ndef.textRecord(invoice.paymentRequest),
        ]);
        await NfcManager.setNdefPush(ndef);
        Alert.alert("Ready to Send", "Touch phones to initiate transfer");
      } else {
        const tag = await NfcManager.getTag();
        if (!tag) throw new Error("No tag found");

        const ndef = tag.ndefMessage[0];
        const paymentRequest = Ndef.text.decodePayload(ndef.payload);

        await payNfcInvoice(paymentRequest);
        Alert.alert("Success", "Payment received successfully");
      }

      setIsComplete(true);
      fetchNfcChannelBalance();
    } catch (error) {
      console.error("NFC payment error:", error);
      Alert.alert("Error", error.message || "Failed to complete NFC payment");
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => 0);
      setIsProcessing(false);
    }
  }, [isNfcSupported, mode, amount, createNfcInvoice, payNfcInvoice]);

  const handleReceive = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      Alert.alert(
        "Payment Received",
        `You've received ${displayAmount[displayCurrency]} ${displayCurrency}`,
        [
          {
            text: "OK",
            onPress: () => {
              setIsComplete(false);
              setAmount("");
              setDisplayAmount({USD: "0", BTC: "0", SATS: "0"});
              navigation.navigate("NFCPay");
            },
          },
        ]
      );
    }, 3000);
  };

  const handleSend = () => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
  
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      Alert.alert(
        "Payment Sent",
        `You've sent ${displayAmount[displayCurrency]} ${displayCurrency}`,
        [
          {
            text: "OK",
            onPress: () => {
              setIsComplete(false);
              setAmount("");
              setDisplayAmount({USD: "0", BTC: "0", SATS: "0"});
              navigation.navigate("NFCPay");
            },
          },
        ]
      );
    }, 3000);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: `${rotation.value}deg`,
        },
      ],
    };
  });

  if (isComplete) {
    return (
      <View style={[styles.container, { backgroundColor: "#1a1a2e" }]}>
        <LottieView
          source={require("../assets/success-animation.json")}
          autoPlay
          loop={false}
          style={styles.successAnimation}
        />
        <Text style={[styles.completeText, { color: "#FFFFFF" }]}>
          {mode === "send" ? "Payment Sent!" : "Payment Received!"}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.container}>
      <TouchableOpacity
        style={[styles.payButton, { backgroundColor: colors.lightning }]}
        disabled={isProcessing}
        onPress={handleNfcPayment}
      >
        {isProcessing ? (
          <LottieView
            ref={nfcAnimation}
            source={require("../assets/nfc-animation.json")}
            autoPlay={true}
            loop
            style={styles.nfcAnimation}
          />
        ) : (
          <Svg
            height="80"
            width="80"
            viewBox="0 0 24 24"
            style={styles.nfcIcon}
          >
            <Path
              d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"
              fill="#FFFFFF"
            />
          </Svg>
        )}
        <Text style={styles.payButtonText}>
          {isProcessing
            ? mode === "send"
              ? "Waiting for Recipient"
              : "Waiting for Sender"
            : "Bump to Pay"}
        </Text>
        {isProcessing && (
          <MaterialCommunityIcons name="cellphone" size={24} color="#FFFFFF" />
        )}
      </TouchableOpacity>

      <Reanimated.View style={[styles.displayContainer, rotationStyle]}>
      <Text style={styles.displayText}>
  {displayAmount[displayCurrency]} {displayCurrency}
</Text>
        <TouchableOpacity onPress={switchDisplayCurrency}>
          <MaterialCommunityIcons
            name="swap-horizontal"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </Reanimated.View>

      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "send" && styles.activeModeButton,
          ]}
          onPress={() => setMode("send")}
        >
          <Text style={styles.modeButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "receive" && styles.activeModeButton,
          ]}
          onPress={() => setMode("receive")}
        >
          <Text style={styles.modeButtonText}>Receive</Text>
        </TouchableOpacity>
      </View>

      {mode === "send" && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="Enter amount in USD"
              keyboardType="numeric"
              placeholderTextColor="#FFFFFF"
            />
          </View>
          <Reanimated.View style={[styles.sendButtonContainer, animatedStyles]}>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </Reanimated.View>
        </>
      )}

      {mode === "receive" && (
        <Reanimated.View style={[styles.sendButtonContainer, animatedStyles]}>
          <TouchableOpacity style={styles.receiveButton} onPress={handleReceive}>
            <Text style={styles.sendButtonText}>Receive</Text>
          </TouchableOpacity>
        </Reanimated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  payButton: {
    width: 300,
    height: 300,
    borderRadius: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    elevation: 5,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  nfcIcon: {
    marginBottom: 10,
  },
  nfcAnimation: {
    width: 200,
    height: 200,
  },
  displayContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  displayText: {
    color: "#FFFFFF",
    fontSize: 28,
    marginRight: 10,
    fontWeight: "bold",
  },
  modeSelector: {
    flexDirection: "row",
    marginBottom: 30,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 10,
    backgroundColor: "#FFA500",
  },
  activeModeButton: {
    backgroundColor: "#FF8C00",
  },
  modeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  amountInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 20,
    color: "#FFFFFF",
    fontSize: 18,
  },
  sendButtonContainer: {
    width: "80%",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  receiveButton: {
    backgroundColor: "#4CAF50", 
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  completeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default NFCPayScreen;
