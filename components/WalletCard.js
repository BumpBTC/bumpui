import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WalletCard = ({ type, balance, address }) => {
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

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <MaterialCommunityIcons name={getIcon()} size={64} color="white" />
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.balanceText}>
            {balance} {type.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.addressText}>{address}</Text>
        <View style={styles.glowDots}>
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
    padding: 20,
    paddingHorizontal: 40,
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
    paddingStart: 100,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  addressText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  glowDots: {
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
});

export default WalletCard;
