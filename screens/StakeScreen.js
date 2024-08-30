import React, { useState, useContext, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const ANNUAL_YIELD = 0.1; // 10% annual yield

const CustomInput = ({ value, onChangeText, placeholder, keyboardType, style }) => {
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
        { backgroundColor: disabled ? colors.disabled : colors.primary }
      ]}
    >
      <Text style={[styles.buttonText, { color: colors.buttonText }]}>{title}</Text>
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
  const [amountStaked, setAmountStaked] = useState(0);
  const [estimatedReward, setEstimatedReward] = useState(0);
  const { balance } = useContext(WalletContext);
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const calculateReward = useCallback((stake, days) => {
    const yearFraction = days / 365;
    return stake * ANNUAL_YIELD * yearFraction;
  }, []);

  useEffect(() => {
    const reward = calculateReward(amountStaked, parseInt(duration));
    setEstimatedReward(reward.toFixed(8));
  }, [amountStaked, duration, calculateReward]);

  const handleStake = useCallback(() => {
    if (!amount) {
      Alert.alert("Error", "Please enter an amount to stake");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const stakedAmount = parseFloat(amount);
      setAmountStaked(prevAmount => prevAmount + stakedAmount);
      setAmount("");
      setIsLoading(false);
      Alert.alert("Success", `Successfully staked ${stakedAmount} BTC for ${duration} days`);
    }, 1500);
  }, [amount, duration]);

  const handleUnstake = useCallback(() => {
    Alert.alert("Unstake", "Unstaking is currently disabled");
  }, []);

  const durationOptions = [
    { label: "30 Days", value: "30" },
    { label: "90 Days", value: "90" },
    { label: "180 Days", value: "180" },
    { label: "365 Days", value: "365" },
  ];

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      <Animatable.View animation="fadeIn" style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Stake Your Bitcoin</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          Earn rewards by staking your Bitcoin. Choose your preferred duration below.
        </Text>

        <View style={styles.balanceContainer}>
          <Text style={[styles.balanceText, { color: colors.text }]}>
            Available Balance: {balance} BTC
          </Text>
          <Text style={[styles.balanceText, { color: colors.text }]}>
            Amount Staked: {amountStaked.toFixed(8)} BTC
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="bitcoin" size={24} color={colors.primary} style={styles.btcIcon} />
          <CustomInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00000000"
            keyboardType="numeric"
            style={styles.amountInput}
          />
          <Text style={[styles.btcLabel, { color: colors.text }]}>BTC</Text>
        </View>

        <CustomPicker
          selectedValue={duration}
          onValueChange={(itemValue) => setDuration(itemValue)}
          items={durationOptions}
        />

        <Text style={[styles.rewardText, { color: colors.primary }]}>
          Estimated Reward After {duration} days: {estimatedReward} BTC
        </Text>

        <CustomButton
          title="Stake Bitcoin"
          onPress={handleStake}
          disabled={isLoading}
          style={styles.stakeButton}
        />

        <CustomButton
          title="Unstake Bitcoin"
          onPress={handleUnstake}
          disabled={true}
          style={styles.unstakeButton}
        />
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    padding: 10,
  },
  btcIcon: {
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
  },
  btcLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stakeButton: {
    width: "50%",
    marginTop: 20,
  },
  unstakeButton: {
    marginTop: 10,
    width: "50%",
    backgroundColor: '#D3D3D3',
  },
});

export default React.memo(StakeScreen);