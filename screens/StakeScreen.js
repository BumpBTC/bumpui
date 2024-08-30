import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Linking,
  ScrollView,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const ANNUAL_YIELD = 0.1; // 10% annual yield

const tokenData = {
  BTC: {
    name: "Bitcoin",
    icon: "bitcoin",
    apy: 0.05, // 5% APY
    platform: "Babylon Labs",
    platformUrl: "https://babylonlabs.io/",
    description:
      "Stake your Bitcoin in Babylon Labs, an emerging leader specializing in Bitcoin staking.",
  },
  ICP: {
    name: "Internet Computer",
    icon: "cloud",
    apy: 0.08, // 8% APY
    platform: "DFINITY Foundation",
    platformUrl: "https://dfinity.org/",
    description:
      "Stake your ICP tokens directly with the DFINITY Foundation to support the Internet Computer network.",
  },
  STX: {
    name: "Stacks",
    icon: "layers",
    apy: 0.09, // 9% APY
    platform: "Friedger Pool",
    platformUrl: "https://pool.friedger.de/",
    description:
      "Stake your STX tokens in the Friedger Pool to earn Bitcoin rewards through Stacks stacking.",
  },
  LTC: {
    name: "Litecoin",
    icon: "litecoin",
    apy: 0.04, // 4% APY
    platform: "Binance Earn",
    platformUrl: "https://www.binance.com/en/earn",
    description:
      "Stake your Litecoin on Binance Earn, a flexible savings product offering competitive interest rates.",
  },
};

const CustomInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  style,
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.customInput, style, { borderColor: colors.border }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={[styles.input, { color: colors.text }]}
        placeholderTextColor={colors.placeholder}
      />
    </View>
  );
};

const CustomButton = ({ title, onPress, disabled, style }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.customButton,
        style,
        { backgroundColor: disabled ? colors.disabled : colors.primary },
      ]}
    >
      <Text style={[styles.buttonText, { color: colors.buttonText }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const CustomPicker = ({ selectedValue, onValueChange, items }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[styles.picker, { color: colors.text }]}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const StakeScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("30");
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [amountStaked, setAmountStaked] = useState(0);
  const [estimatedReward, setEstimatedReward] = useState(0);
  const { balance } = useContext(WalletContext);
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const calculateReward = useCallback((stake, days, apy) => {
    const yearFraction = days / 365;
    return stake * apy * yearFraction;
  }, []);

  useEffect(() => {
    const inputAmount = parseFloat(amount) || 0;
    const reward = calculateReward(
      inputAmount,
      parseInt(duration),
      tokenData[selectedToken].apy
    );
    setEstimatedReward(reward.toFixed(8));
  }, [amount, duration, selectedToken, calculateReward]);

  const handleStake = useCallback(() => {
    if (!amount) {
      Alert.alert("Error", "Please enter an amount to stake");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const stakedAmount = parseFloat(amount);
      setAmountStaked((prevAmount) => prevAmount + stakedAmount);
      setAmount("");
      setIsLoading(false);
      Alert.alert(
        "Success",
        `Successfully staked ${stakedAmount} ${selectedToken} for ${duration} days`
      );
    }, 1500);
  }, [amount, duration, selectedToken]);

  const handleUnstake = useCallback(() => {
    Alert.alert("Unstake", "Unstaking is currently disabled");
  }, []);

  const durationOptions = [
    { label: "30 Days", value: "30" },
    { label: "90 Days", value: "90" },
    { label: "180 Days", value: "180" },
    { label: "365 Days", value: "365" },
  ];

  const tokenOptions = Object.keys(tokenData).map((token) => ({
    label: tokenData[token].name,
    value: token,
  }));

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="fadeIn" style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Stake Your Crypto
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            Easily stake multiple cryptocurrencies on leading platforms through
            our service. No fees!
          </Text>

          <CustomPicker
            selectedValue={selectedToken}
            onValueChange={(itemValue) => setSelectedToken(itemValue)}
            items={tokenOptions}
          />

          <Text style={[styles.description, { color: colors.text }]}>
            {tokenData[selectedToken].description}
     

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(tokenData[selectedToken].platformUrl)
            }
          >
            <Text style={[styles.linkText, { color: 'blue' }]}>
              Learn more about {tokenData[selectedToken].platform}
            </Text>
          </TouchableOpacity>     </Text>

          <View style={styles.balanceContainer}>
            <Text style={[styles.balanceText, { color: colors.text }]}>
              Available Balance: {balance} {selectedToken}
            </Text>
            <Text style={[styles.balanceText, { color: colors.text }]}>
              Amount Staked: {amountStaked.toFixed(8)} {selectedToken}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name={tokenData[selectedToken].icon}
              size={24}
              color={colors.primary}
              style={styles.tokenIcon}
            />
            <CustomInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00000000"
              keyboardType="numeric"
              style={styles.amountInput}
            />
            <Text style={[styles.tokenLabel, { color: colors.text }]}>
              {selectedToken}
            </Text>
          </View>

          <CustomPicker
            selectedValue={duration}
            onValueChange={(itemValue) => setDuration(itemValue)}
            items={durationOptions}
          />

          <Text style={[styles.rewardText, { color: colors.primary }]}>
            Estimated Reward After {duration} days: {estimatedReward}{" "}
            {selectedToken}
          </Text>
          <Text style={[styles.apyText, { color: colors.text }]}>
            Current APY: {(tokenData[selectedToken].apy * 100).toFixed(2)}%
          </Text>

          <CustomButton
            title={`Stake ${selectedToken}`}
            onPress={handleStake}
            disabled={isLoading}
            style={styles.stakeButton}
          />

          <CustomButton
            title={`Unstake ${selectedToken}`}
            onPress={handleUnstake}
            disabled={true}
            style={styles.unstakeButton}
          />
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    padding: 10,
  },
  tokenIcon: {
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
  },
  tokenLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  rewardText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  customInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  input: {
    fontSize: 16,
  },
  customButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stakeButton: {
    width: "50%",
    marginTop: 20,
  },
  unstakeButton: {
    marginTop: 10,
    width: "50%",
    backgroundColor: "#D3D3D3",
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  apyText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default React.memo(StakeScreen);
