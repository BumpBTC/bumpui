import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const WalletCard = ({
  type,
  balance,
  address,
  currency,
  label,
  exchangeRate,
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [showUSD, setShowUSD] = useState(false);

  const getGradientColors = () => {
    switch (type) {
      case "bitcoin":
        return ["#FF9900", "#F7931A"];
      case "lightning":
        return ["#792DE4", "#7B68EE"];
      case "litecoin":
        return ["#345D9D", "#A0B9E7"];
      default:
        return ["#4A90E2", "#50E3C2"];
    }
  };

  const toggleCurrency = () => {
    setShowUSD(!showUSD);
  };

  const getIcon = () => {
    switch (type) {
      case "bitcoin":
        return "bitcoin";
      case "lightning":
        return "lightning-bolt";
      case "litecoin":
        return "litecoin";
      default:
        return "wallet";
    }
  };

  const toggleAddressDisplay = () => {
    setShowFullAddress(!showFullAddress);
  };

  const copyAddress = () => {
    Clipboard.setString(address);
    // You might want to show a toast or alert here to confirm the copy action
  };

  const displayAddress = showFullAddress
    ? address
    : `${address.slice(0, 5)}...${address.slice(-6)}`;

  const displayBalance = showUSD
    ? `$${(balance * exchangeRate).toFixed(2)}`
    : `${balance} ${currency}`;

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <MaterialCommunityIcons name={getIcon()} size={64} color="white" />
      <View style={styles.iconContainer}>
        {/* <Icon name={getIconName(type)} size={40} color="#fff" /> */}
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.balanceText}>{displayBalance}</Text>
        {/* <Switch
          value={showUSD}
          onValueChange={toggleCurrency}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={showUSD ? "#f5dd4b" : "#f4f3f4"}
        /> */}

        <TouchableOpacity
          style={styles.addressContainer}
          onPress={toggleAddressDisplay}
        >
          <Text style={styles.addressText}>{address}</Text>
        </TouchableOpacity>

        <View style={styles.glowDots}>
          <TouchableOpacity onPress={copyAddress}>
            <MaterialCommunityIcons
              name="content-copy"
              size={20}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={copyAddress}>
            <TouchableOpacity
              onPress={displayAddress}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name="eye" size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
          {[...Array(4)].map((_, i) => (
            <View key={i} style={styles.glowDot} />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 40,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardContent: {
    height: 60,
    paddingStart: 150,
    justifyContent: "space-between",
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  balanceText: {
    flexDirection: "row",
    justifyContent: "flex-end",
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  glowDots: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  glowDotsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  glowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginLeft: 5,
  },
  label: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#fff",
    marginTop: 5,
    marginLeft: 4,
  },
});

export default WalletCard;
