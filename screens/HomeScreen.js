import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import BalanceDisplay from "../components/BalanceDisplay";
import Button from "../components/Button";
import TransactionList from "../components/TransactionList";
import { Picker } from "@react-native-picker/picker";
import CurrencySelector from "../components/CurrencySelector";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

const HomeScreen = ({ navigation }) => {
  const { colors, isDarkMode, setWalletTheme } = useTheme();
  const {
    selectedCrypto,
    setSelectedCrypto,
    wallets,
    transactions,
    fetchWalletData,
    isLoading,
    error,
  } = useContext(WalletContext);

  const [selectedWallet, setSelectedWallet] = useState("bitcoin");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchWalletData();
    });
    return unsubscribe;
  }, [navigation, fetchWalletData]);

  const handleRefresh = () => {
    fetchWalletData();
  };

  const handleWalletChange = (itemValue) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedWallet(itemValue);
      setWalletTheme(itemValue);
      slideAnim.setValue(100);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const renderActionButton = (title, iconName, onPress) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <Icon name={iconName} size={28} color={colors.primary} />
      <Text style={[styles.actionButtonText, { color: colors.text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const gradientColors = isDarkMode
    ? [colors.background, colors.primary + "44"]
    : [colors.background, colors.primary + "22"];

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {error && (
          <Animatable.View animation="shake" style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          </Animatable.View>
        )}

        <View style={styles.walletSelectorContainer}>
          <CurrencySelector
            selectedCrypto={selectedCrypto}
            onSelect={() => {
              const cryptos = ["bitcoin", "lightning", "litecoin"];
              const currentIndex = cryptos.indexOf(selectedCrypto);
              const nextIndex = (currentIndex + 1) % cryptos.length;
              setSelectedCrypto(cryptos[nextIndex]);
            }}
          />
        </View>

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <BalanceDisplay
            type={selectedWallet}
            balance={
              wallets.find((w) => w.type === selectedWallet)?.balance || 0
            }
            currency={
              selectedWallet === "bitcoin"
                ? "BTC"
                : selectedWallet === "lightning"
                ? "sat"
                : "LTC"
            }
            address={
              wallets.find((w) => w.type === selectedWallet)?.address || ""
            }
          />
        </Animated.View>

        <View style={styles.buttonContainer}>
          {renderActionButton("Send", "send", () =>
            navigation.navigate("Send")
          )}
          {renderActionButton("Bump Pay", "nfc", () =>
            navigation.navigate("NFCPay")
          )}
          {renderActionButton("Receive", "qrcode", () =>
            navigation.navigate("Receive")
          )}
          {renderActionButton("Stake", "bank", () =>
            navigation.navigate("Stake")
          )}
          {renderActionButton("Security", "shield-check", () =>
            navigation.navigate("Security")
          )}
          {renderActionButton("Shop", "shopping", () =>
            navigation.navigate("Shop")
          )}
        </View>

        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={styles.lightningButtonContainer}
        >
          <Button
            title="⚡ Pay with Lightning Network"
            onPress={() => navigation.navigate("Lightning")}
            style={styles.lightningButton}
            icon="flash"
          />
        </Animatable.View>

        <TransactionList
          transactions={transactions.filter(
            (t) => t.walletType === selectedWallet
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffeeee",
    borderRadius: 5,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  walletSelectorContainer: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  walletSelector: {
    height: 50,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  lightningButtonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  lightningButton: {
    backgroundColor: "#9146FF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
  },
});

export default HomeScreen;
