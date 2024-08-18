import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
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
import { Svg, Path } from "react-native-svg";
import LottieView from "lottie-react-native";
import Button from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const NFCPayScreen = ({ navigation }) => {
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
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
        throw new Error(`No ${currency} wallet found`);
      }

      // await sendTransaction(selectedCrypto, "MERCHANT_ADDRESS", amount);
      const txid = await sendTransaction(currency, address, amount);
      Alert.alert(
        "Success",
        `Payment of ${amount} ${currency} sent successfully. TXID: ${txid}`
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
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      {" "}
      {renderCryptoSelector()}
      {renderAmount()}
      <TouchableOpacity
        style={[styles.payButton, { backgroundColor: colors.primary }]}
        onPress={handleNfcPayment}
        disabled={isProcessing}
      >
        <Animated.View style={[styles.pixelOverlay, pixelStyle]} />
        <Svg height="40" width="40" viewBox="0 0 24 24" style={styles.nfcIcon}>
          <Path
            d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V8h3v8H8V8h2V6H6v12h12V6z"
            fill="#FFFFFF"
          />
        </Svg>
        <Text style={styles.payButtonText}>
          {isProcessing ? "Processing..." : "Hold Here to Pay"}
        </Text>
        <Animated.View style={[styles.processingOverlay, processingStyle]} />
      </TouchableOpacity>
      {/* <Animatable.View animation="fadeIn" style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>NFC Payment</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Tap your device to an NFC terminal to make a payment.
        </Text>
        <Button
          title={isScanning ? "Scanning..." : "Scan NFC"}
          onPress={handleNFCScan}
          loading={isScanning}
          style={styles.button}
        />
      </Animatable.View> */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cryptoSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  cryptoOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  amountText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginRight: 10,
  },
  switchIcon: {
    marginLeft: 10,
  },
  payButton: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    overflow: 'hidden',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pixelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
    fontWeight: 'bold',
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