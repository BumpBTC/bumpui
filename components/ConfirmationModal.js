import React, { useContext, useState } from "react";
import { WalletContext } from "../contexts/WalletContext";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import api from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ConfirmationModal = ({ visible, onClose, onConfirm, details }) => {
  const translateX = useSharedValue(0);
  const { colors } = useTheme();
  const { sendTransaction } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Retrieve the wallet information first
      const walletResponse = await api.get("/wallet/info");
      const bitcoinWallet = walletResponse.data.wallets.find(w => w.type === 'bitcoin');
      
      if (!bitcoinWallet) {
        throw new Error("Bitcoin wallet not found");
      }
      
      let response;
      switch (details.currency) {
        case "bitcoin":
          response = await api.post("/wallet/send-bitcoin", {
            toAddress: details.recipient,
            amount: parseFloat(details.amount),
          });
          break;
        case "lightning":
          response = await api.post("/lightning/pay-invoice", {
            paymentRequest: details.recipient,
          });
          break;
        case "litecoin":
          response = await api.post("/wallet/send-litecoin", {
            toAddress: details.recipient,
            amount: parseFloat(details.amount),
          });
          break;
        default:
          throw new Error("Unsupported currency");
      }

      setIsLoading(false);
      onClose();
      navigation.navigate("TransactionStatus", {
        status: "success",
        txid: response.data.txid,
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Transaction failed:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Transaction failed. Please try again."
      );
    }
  };

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = Math.max(0, Math.min(event.translationX, 200));
    },
    onEnd: () => {
      if (translateX.value > 150) {
        runOnJS(handleConfirm)();
      } else {
        translateX.value = 0;
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Confirm Payment
          </Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            Send to: {details.recipient}
          </Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            Amount: {details.amount} {details.currency}
          </Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            Network Cost: {details.networkCost}
          </Text>
          <Text style={[styles.detailText, { color: colors.text }]}>
            Total: {details.total} {details.currency}
          </Text>
          {/* <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.slider, rStyle, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="gesture-swipe-right" size={24} color={colors.background} />
            <Text style={[styles.sliderText, { color: colors.background }]}>Slide to send</Text>
          </Animated.View>
        </PanGestureHandler> */}
          <TouchableOpacity onPress={handleConfirm} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: colors.text }]}>
              Confirm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  slider: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
  },
  sliderText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 20,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
  },
});

export default ConfirmationModal;
