import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card, ListItem } from "react-native-elements";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import Button from "../components/Button";
import { LinearGradient } from "expo-linear-gradient";

const BlockchainCredentialsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { wallets, updateSecurityLevel, securityLevel } =
    useContext(WalletContext);

  const credentials = [
    {
      type: "ICP",
      details: {
        username: "test1",
        email: "test1@test.com",
        password: "********",
        address: "icp1234...5678",
        pubKey: "icppub1234...5678",
        privKey: "********",
        mnemonic: "********",
      },
    },
    {
      type: "Stacks",
      details: {
        username: "test1",
        email: "test1@test.com",
        password: "********",
        address: "stx1234...5678",
        pubKey: "stxpub1234...5678",
        privKey: "********",
        mnemonic: "********",
      },
    },
    {
      type: "Ordinal",
      details: {
        username: "test1",
        email: "test1@test.com",
        password: "********",
        address: "ord1234...5678",
        pubKey: "ordpub1234...5678",
        privKey: "********",
        mnemonic: "********",
      },
    },
  ];

  const renderWalletDetails = (wallet) => (
    <View key={wallet.id} style={styles.walletContainer}>
      <Text style={[styles.walletTitle, { color: colors.text }]}>
        {wallet.type} Wallet
      </Text>
      <Text style={[styles.walletDetail, { color: colors.text }]}>
        Username: {wallet.username}
      </Text>
      <Text style={[styles.walletDetail, { color: colors.text }]}>
        Email: {wallet.email}
      </Text>
      <Text style={[styles.walletDetail, { color: colors.text }]}>
        Address: {wallet.address}
      </Text>
      <Text style={[styles.walletDetail, { color: colors.text }]}>
        Public Key: {wallet.publicKey}
      </Text>
    </View>
  );

  const handleSetupComplete = async () => {
    if (securityLevel < 1) {
      await updateSecurityLevel(1);
      navigation.goBack();
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        {credentials.map((cred, index) => (
          <Card key={index}>
            <Card.Title>{cred.type} Credentials</Card.Title>
            <Card.Divider />
            {Object.entries(cred.details).map(([key, value]) => (
              <ListItem key={key}>
                <ListItem.Content>
                  <ListItem.Title>{key}</ListItem.Title>
                  <ListItem.Subtitle>{value}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ))}
            <View style={styles.recommendationContainer}>
              <TouchableOpacity
                style={[
                  styles.recommendationButton,
                  { backgroundColor: colors.primary },
                ]}
                // onPress={() =>
                //   navigation.navigate(recommendedNextStep.screenName)
                // }
              >
                <Text
                  style={[
                    styles.recommendationButtonText,
                    { color: colors.background },
                  ]}
                >
                  Download
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

// return (
//     <LinearGradient colors={[colors.background, colors.primary + '22']} style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={[styles.title, { color: colors.text }]}>Blockchain Credentials</Text>
//         {wallets.map(renderWalletDetails)}
//         <Button title="Complete Setup" onPress={handleSetupComplete} style={styles.button} />
//       </ScrollView>
//     </LinearGradient>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  walletContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  walletDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
  },
  recommendationContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recommendationButton: {
    padding: 10,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
  },
  recommendationButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BlockchainCredentialsScreen;

// TODO: Implement secure storage for sensitive information
// TODO: Add option to reveal/hide sensitive information
// TODO: Implement copy to clipboard functionality
