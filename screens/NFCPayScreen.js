import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import NfcManager, { NfcEvents } from "react-native-nfc-manager";
import Button from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

const NFCPayScreen = ({ navigation }) => {
  const [isNfcEnabled, setIsNfcEnabled] = useState(false);
  const { sendNFCPayment } = useContext(WalletContext);
  const [isScanning, setIsScanning] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const checkNfcSupport = async () => {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setIsNfcEnabled(true);
      }
    };

    checkNfcSupport();

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent();
    };
  }, []);

  const handleStartNFC = async () => {
    try {
      await NfcManager.registerTagEvent();
      Alert.alert("NFC", "Tap your phone to another NFC-enabled device to pay");
    } catch (ex) {
      console.log("Error registering NFC:", ex);
      Alert.alert("Error", "Failed to start NFC payment");
    }
  };

  const handleNFCScan = useCallback(async () => {
    setIsScanning(true);
    try {
      // Simulating NFC scan and payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const paymentResult = await sendNFCPayment();
      Alert.alert("Success", "NFC Payment sent successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to complete NFC payment");
    } finally {
      setIsScanning(false);
    }
  }, [sendNFCPayment]);

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      <Animatable.View animation="fadeIn" style={styles.content}>
        {Platform.OS === "ios" ? (
          <>
            <Text style={[styles.errorText, { color: colors.text }]}>
              NFC payments are not supported on iOS
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              NFC Payment
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Tap your device to an NFC terminal to make a payment.
            </Text>
          </>
        ) : isNfcEnabled ? (
          <>
            <Button
              title={isScanning ? "Scanning..." : "Scan NFC"}
              onPress={handleNFCScan}
              loading={isScanning}
              style={styles.button}
            />
            <Button title="Start NFC Payment" onPress={handleStartNFC} />
          </>
        ) : (
          <Text style={[styles.errorText, { color: colors.text }]}>
            NFC is not supported on this device
          </Text>
        )}
      </Animatable.View>
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
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
});

export default NFCPayScreen;
