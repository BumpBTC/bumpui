import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from "react-native";
import WalletCard from "../components/WalletCard";
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
import { getWalletInfo } from "../services/api";

const HomeScreen = ({ navigation, balance, address, route }) => {
  // const { user } = route.params;
  const { colors, isDarkMode, setWalletTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [username, setUsername] = useState(false);
  const {
    selectedCrypto,
    setSelectedCrypto,
    wallet,
    wallets,
    transactions,
    createWallet,
    fetchWalletInfo,
    fetchWalletData,
    error,
  } = useContext(WalletContext);
  const [selectedWallet, setSelectedWallet] = useState("bitcoin");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isCheckingOnTop, setIsCheckingOnTop] = useState(true);
  const cardAnimationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchWalletData();
    loadWalletData();
    const fetchWalletInfo = async () => {
      try {
        const info = await getWalletInfo();
        setWalletInfo(info);
      } catch (error) {
        console.error("Error fetching wallet info:", error);
      }
    };
    fetchWalletInfo();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     fetchWalletData();
  //   });
  //   return unsubscribe;
  // }, [navigation, fetchWalletData]);

  // useEffect(() => {
  //   const active = wallets.find((wallet) => wallet.isActive);
  //   setActiveWallet(active);
  // }, [wallets]);

  const loadWalletData = async () => {
    setIsLoading(true);
    try {
      await fetchWalletData();
      const info = await getWalletInfo();
      setWalletInfo(info);
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    try {
      await createWallet(selectedCrypto);
      await loadWalletData();
    } catch (error) {
      console.error("Failed to create wallet:", error);
    }
  };

  const handleRefresh = async () => {
    await loadWalletData();
  };

  const activeWallet = wallets.find((w) => w.type === selectedCrypto) || {};

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

  const handleCardSwitch = () => {
    Animated.timing(cardAnimationValue, {
      toValue: isCheckingOnTop ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsCheckingOnTop(!isCheckingOnTop);
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

  const checkingCardStyle = {
    zIndex: cardAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 1],
    }),
    transform: [
      {
        translateY: cardAnimationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
      },
    ],
  };

  const savingsCardStyle = {
    zIndex: cardAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2],
    }),
    transform: [
      {
        translateY: cardAnimationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-160, -180],
        }),
      },
    ],
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {error && (
          <Animatable.View animation="shake" style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          </Animatable.View>
        )}

        {/* <View style={styles.walletSelector}>
          {wallets.map((wallet) => (
            <TouchableOpacity
              key={wallet.type}
              style={[
                styles.walletOption,
                selectedCrypto === wallet.type && styles.selectedWallet,
              ]}
              onPress={() => setSelectedCrypto(wallet.type)}
            >
              <Text style={[styles.walletOptionText, { color: colors.text }]}>
                {wallet.type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}

        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Let's Bump{" "}{" "}
          <View style={styles.walletSelectorContainer}>
            <CurrencySelector
              selectedCrypto={selectedCrypto}
              onSelect={handleWalletChange}
              // onSelect={() => {
              //   const cryptos = ["bitcoin", "lightning", "litecoin"];
              //   const currentIndex = cryptos.indexOf(selectedCrypto);
              //   const nextIndex = (currentIndex + 1) % cryptos.length;
              //   setSelectedCrypto(cryptos[nextIndex]);
              // }}
            />
          </View>
        </Text>

        <TouchableOpacity
          onPress={handleCardSwitch}
          style={styles.cardsContainer}
        >
          <Animated.View style={checkingCardStyle}>
            <WalletCard
              type={selectedCrypto}
              balance={(parseFloat(activeWallet.balance || "0") * 0.1).toFixed(
                2
              )}
              address={activeWallet.address || ""}
              currency={
                selectedCrypto === "bitcoin"
                  ? "BTC"
                  : selectedCrypto === "lightning"
                  ? "SATS"
                  : "LTC"
              }
              label="CHECKING"
            />
          </Animated.View>

          <Animated.View style={savingsCardStyle}>
            <WalletCard
              type={selectedCrypto}
              balance={(parseFloat(activeWallet.balance || "0") * 0.1).toFixed(
                2
              )}
              address={activeWallet.address || ""}
              currency={
                selectedCrypto === "bitcoin"
                  ? "BTC"
                  : selectedCrypto === "lightning"
                  ? "SATS"
                  : "LTC"
              }
              label="SAVINGS"
            />
          </Animated.View>
        </TouchableOpacity>

        {walletInfo && walletInfo.wallets && walletInfo.wallets[0] && (
          <View>
            <Text style={styles.walletInfo}>
              Bitcoin Address: {walletInfo.wallets[0].address}
            </Text>
            <Text style={styles.walletInfo}>
              Balance: {walletInfo.wallets[0].balance} BTC
            </Text>
          </View>
        )}

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
            (t) => t.walletType === selectedCrypto
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  cardsContainer: {
    marginBottom: 40,
    padding: 10,
    height: 200, // Adjust this value based on your card height
  },
  savingsCardPlaceholder: {
    height: 180,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    marginTop: -160,
    zIndex: -1,
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
    marginVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    overflow: "hidden",
  },
  walletOption: {
    padding: 10,
    borderRadius: 20,
  },
  selectedWallet: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  walletOptionText: {
    fontWeight: "bold",
  },
  walletInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 20,
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
  createWalletContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  createWalletText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  loginLink: {
    marginTop: 20,
    color: "blue",
  },
  signupLink: {
    marginTop: 20,
    color: "blue",
  },
  address: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default HomeScreen;
