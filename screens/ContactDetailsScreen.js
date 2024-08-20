import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Button from "../components/Button";
import api from "../services/api";

const ContactDetailsScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const { colors } = useTheme();

  const handleShare = () => {
    // Implement share functionality
  };

  const handleCopy = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied", "Address copied to clipboard");
  };

  const handleSendMoney = () => {
    if (contact.bitcoinAddress) {
      navigation.navigate("Send", { contact, network: "bitcoin" });
    } else if (contact.lightningPublicKey) {
      navigation.navigate("Send", { contact, network: "lightning" });
    } else if (contact.litecoinAddress) {
      navigation.navigate("Send", { contact, network: "litecoin" });
    } else {
      Alert.alert("No Address", "This contact has no saved addresses");
    }
  };

  const handleOpenChannel = () => {
    if (contact.lightningPublicKey) {
      navigation.navigate("Lightning", {
        screen: "OpenChannel",
        params: { contact },
      });
    } else {
      Alert.alert(
        "No Lightning Address",
        "This contact has no Lightning public key"
      );
    }
  };

  const handleEdit = () => {
    navigation.navigate("EditContact", { contact });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/contacts/${contact._id}`);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to delete contact:", error);
      Alert.alert("Error", "Failed to delete contact");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={
          contact.picture
            ? { uri: contact.picture }
            : require("../assets/default-avatar.png")
        }
        style={styles.avatar}
      />
      <Text style={[styles.name, { color: colors.text }]}>{contact.name}</Text>

      <View style={styles.actionBar}>
        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
          <MaterialCommunityIcons
            name="share-variant"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.actionText, { color: colors.text }]}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendMoney} style={styles.actionButton}>
          <MaterialCommunityIcons
            name="send"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.actionText, { color: colors.text }]}>
            Send Money
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOpenChannel}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.actionText, { color: colors.text }]}>
            Open Channel
          </Text>
        </TouchableOpacity>
      </View>

      {contact.lightningPublicKey && (
        <View style={styles.addressContainer}>
          <Text style={[styles.addressLabel, { color: colors.text }]}>
            Lightning Public Key:
          </Text>
          <Text style={[styles.address, { color: colors.text }]}>
            {contact.lightningPublicKey}
          </Text>
          <TouchableOpacity
            onPress={() => handleCopy(contact.lightningPublicKey)}
          >
            <MaterialCommunityIcons
              name="content-copy"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}

      {contact.litecoinAddress && (
        <View style={styles.addressContainer}>
          <Text style={[styles.addressLabel, { color: colors.text }]}>
            Litecoin Address:
          </Text>
          <Text style={[styles.address, { color: colors.text }]}>
            {contact.litecoinAddress}
          </Text>
          <TouchableOpacity onPress={() => handleCopy(contact.litecoinAddress)}>
            <MaterialCommunityIcons
              name="content-copy"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.editDeleteContainer}>
        <Button title="Edit" onPress={handleEdit} style={styles.editButton} />
        <Button
          title="Delete"
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    marginTop: 5,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addressLabel: {
    fontWeight: "bold",
    marginRight: 10,
  },
  address: {
    flex: 1,
  },
  editDeleteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "red",
  },
});

export default ContactDetailsScreen;
