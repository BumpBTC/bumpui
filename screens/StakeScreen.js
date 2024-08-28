import React, { useState, useContext, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import Input from "../components/Input";
import Button from "../components/Button";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import api from "../services/api";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StakeScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("30d");
  const { balance } = useContext(WalletContext);
  const { colors } = useTheme();
  const { stakeTokens } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);

  // const handleStake = async () => {
  //   try {
  //     const response = await api.post('/stake/stake', { amount });
  //     Alert.alert(
  //       'Staking Successful',
  //       `You have staked ${amount} BTC successfully.`,
  //       [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
  //     );
  //   } catch (error) {
  //     Alert.alert('Error', error.response?.data?.error || 'Failed to stake');
  //   }
  // };

  const handleStake = useCallback(async () => {
    if (!amount || !duration) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate staking process
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          "Success",
          `Successfully staked ${amount} BTC for ${duration}`
        );
        setAmount("");
      }, 2000);
      // await stakeTokens(parseFloat(amount), parseInt(duration));
      // Alert.alert('Success', 'Tokens staked successfully');
      // setAmount('');
      // setDuration('');
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to stake tokens");
    } finally {
      setIsLoading(false);
    }
  }, [amount, duration, stakeTokens]);

  const estimatedReward = (parseFloat(amount || 0) * 0.05).toFixed(8);

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

        <Text style={[styles.description2, { color: colors.text }]}>
          Note: BTC is stacked on Bitcoin L2, Stacks. Ream more about stacking
          here - https://www.stacks.co/learn/stacking
        </Text>

        <Text style={[styles.balanceText, { color: colors.text }]}>
          Available Balance: {balance} BTC
        </Text>

       <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="bitcoin" size={24} color={colors.primary} style={styles.btcIcon} />
          <Input
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00000000"
            keyboardType="numeric"
            style={styles.amountInput}
          />
          <Text style={[styles.btcLabel, { color: colors.text }]}>BTC</Text>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={[styles.pickerLabel, { color: colors.text }]}>Staking Duration:</Text>
          <Picker
            selectedValue={duration}
            onValueChange={(itemValue) => setDuration(itemValue)}
            style={[styles.picker, { color: colors.text }]}
          >
            <Picker.Item label="30 Days" value="30d" />
            <Picker.Item label="3 Months" value="3m" />
            <Picker.Item label="6 Months" value="6m" />
            <Picker.Item label="1 Year" value="1y" />
          </Picker>
        </View>

        <Text style={[styles.balanceText, { color: colors.text }]}>Available Balance: {balance} BTC</Text>
        <Text style={[styles.rewardText, { color: colors.primary }]}>
          Estimated Annual Reward: {estimatedReward} BTC
        </Text>

        <Button 
          title="Stake Bitcoin"
          onPress={handleStake}
          loading={isLoading}
          style={styles.stakeButton}
        />
        <Text style={[styles.estimatedRewards, { color: colors.text }]}>
          Estimated Annual Reward: {estimatedReward} BTC
        </Text>
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
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  description2: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  estimatedRewards: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
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
    fontSize: 18,
    color: '#fff',
  },
  btcLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stakeButton: {
    marginTop: 20,
  },
});

export default React.memo(StakeScreen);
