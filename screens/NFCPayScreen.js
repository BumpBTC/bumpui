import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import {
  Svg,
  Path,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
// import LottieView from "lottie-react-native";
import LottieView from "../components/LottieView";
import Button from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const NFCPayScreen = ({ navigation }) => {
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [amount, setAmount] = useState(17.25);
  const [inCrypto, setInCrypto] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { colors } = useTheme();
  const { sendTransaction, wallets } = useContext(WalletContext);

  const pixelAnimation = useSharedValue(0);
  const processingAnimation = useSharedValue(1);

  useEffect(() => {
    pixelAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );

    const checkNfcSupport = async () => {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setIsNfcSupported(true);
      }
    };
    checkNfcSupport();

    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    };
  }, []);

  const pixelStyle = useAnimatedStyle(() => {
    return {
      opacity: pixelAnimation.value,
    };
  });

  const processingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: processingAnimation.value }],
    };
  });

  const handleNfcPayment = useCallback(async () => {
    if (!isNfcSupported) {
      Alert.alert("Error", "NFC is not supported on this device");
      return;
    }

    setIsProcessing(true);
    processingAnimation.value = withSpring(1.2);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (!tag) throw new Error("No tag found");

      const message = Ndef.decodeMessage(tag.ndefMessage);
      const paymentInfo = JSON.parse(message[0].payload);

      const { amount, address, currency } = paymentInfo;
      const wallet = wallets.find(
        (w) => w.type.toLowerCase() === currency.toLowerCase()
      );

      if (!wallet) {
        throw new Error(`No ${selectedCrypto} wallet found`);
      }

      // await sendTransaction(selectedCrypto, "MERCHANT_ADDRESS", amount);
      const txid = await sendTransaction(
        currency,
        selectedCrypto,
        address,
        parseFloat(amount)
      );
      Alert.alert(
        "Success",
        `Payment of ${amount} ${selectedCrypto} sent successfully. TXID: ${txid}`
      );
      setIsComplete(true);
    } catch (error) {
      console.error("NFC payment error:", error);
      Alert.alert("Error", error.message || "Failed to complete NFC payment");
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => 0);
      setIsProcessing(false);
    }
  }, [isNfcSupported, selectedCrypto, amount, wallets, sendTransaction]);

  const getCryptoIcon = (crypto) => {
    switch (crypto) {
      case "bitcoin":
        return "₿";
      case "lightning":
        return "⚡";
      case "litecoin":
        return "Ł";
      default:
        return "";
    }
  };

  const getThemeColor = () => {
    switch (selectedCrypto) {
      case "bitcoin":
        return colors.bitcoin;
      case "lightning":
        return colors.lightning;
      case "litecoin":
        return colors.litecoin;
      default:
        return colors.primary;
    }
  };

  if (Platform.OS === "ios") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          NFC payments are not supported on iOS
        </Text>
      </View>
    );
  }

  if (isComplete) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LottieView
          source={require("../assets/success-animation.json")}
          autoPlay
          loop={false}
          style={styles.successAnimation}
        />
        <Text style={[styles.completeText, { color: colors.text }]}>
          Payment Complete!
        </Text>
      </View>
    );
  }

  const renderCryptoSelector = () => (
    <View style={styles.cryptoSelector}>
      {["bitcoin", "lightning", "litecoin"].map((crypto) => (
        <TouchableOpacity
          key={crypto}
          style={[
            styles.cryptoOption,
            {
              backgroundColor:
                selectedCrypto === crypto ? colors.primary : colors.background,
            },
          ]}
          onPress={() => setSelectedCrypto(crypto)}
        >
          <Text
            style={[
              styles.cryptoText,
              {
                color:
                  selectedCrypto === crypto ? colors.background : colors.text,
              },
            ]}
          >
            {crypto[0].toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAmount = () => (
    <TouchableOpacity
      onPress={() => setInCrypto(!inCrypto)}
      style={styles.amountContainer}
    >
      <Text style={styles.amountText}>
        {inCrypto
          ? `${amount.toFixed(8)} ${selectedCrypto.toUpperCase()}`
          : `$${amount.toFixed(2)}`}
      </Text>
      <Svg height="24" width="24" viewBox="0 0 24 24" style={styles.switchIcon}>
        <Path
          d="M7.5 21.5L3 17l4.5-4.5L9 14l-3 3h8v2H6l3 3-1.5 1.5zM16.5 2.5L21 7l-4.5 4.5L15 10l3-3H10V5h8l-3-3 1.5-1.5z"
          fill={colors.text}
        />
      </Svg>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#000033", "#333333"]} style={styles.container}>
      <TouchableOpacity
        style={[styles.payButton, { backgroundColor: getThemeColor() }]}
        onPress={handleNfcPayment}
        disabled={isProcessing}
      >
        <Animated.View style={[styles.pixelOverlay, pixelStyle]} />
        <Svg height="80" width="80" viewBox="0 0 24 24" style={styles.nfcIcon}>
          <Path
            d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"
            fill="#FFFFFF"
          />
        </Svg>
        <Text style={styles.payButtonText}>
          {isProcessing ? "Processing..." : "Hold Here to Pay"}
        </Text>
      </TouchableOpacity>
      <View style={styles.content}>
  
        <View style={[{ backgroundColor: getThemeColor(), pb: 10 }]}>
          <TouchableOpacity
            style={styles.cryptoSelector}
            onPress={() => {
              const cryptos = ["bitcoin", "lightning", "litecoin"];
              const currentIndex = cryptos.indexOf(selectedCrypto);
              const nextIndex = (currentIndex + 1) % cryptos.length;
              setSelectedCrypto(cryptos[nextIndex]);
            }}
          >
            <Text style={styles.cryptoIcon}>
              {getCryptoIcon(selectedCrypto)}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.amountText, { paddingVertical: 10 }]}>
          {selectedCrypto.toUpperCase()}
        </Text>
        <TextInput
          style={styles.amountInput2}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        {/* {renderCryptoSelector()} */}
        {renderAmount()}
        </View>


      {/* <Svg height={height / 3} width={width}>
        <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#000033" stopOpacity="1" />
          <Stop offset="1" stopColor="#333333" stopOpacity="1" />
        </SvgGradient>
        <Path
          d="M0 0 L${width} 0 L${width} ${height/3} Q${width/2} ${height/2.5} 0 ${height/3} Z"
          fill="url(#grad)"
        />
      </Svg>{" "} */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cryptoSelector: {
    borderRadius: 15,
    padding: 4,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  cryptoOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cryptoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cryptoIcon: {
    fontSize: 18,
    fontWeight: "bold",
  },
  payeeText: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    
  },
  amountText: {
    fontSize: 36,
    fontWeight: "bold",
    marginRight: 10,
  },
  switchIcon: {
    marginLeft: 10,
  },
  amountInput: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    
  },
  amountInput2: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  payButton: {
    width: width * 2,
    height: width * 0.8,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -60,
    overflow: "hidden",
  },
  paymentBox: {
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  pixelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  nfcIcon: {
    marginBottom: 10,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: 200,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default NFCPayScreen;
