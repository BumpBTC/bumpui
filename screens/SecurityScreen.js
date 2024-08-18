import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../components/Button";
import Input from "../components/Input";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

const SecurityScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { securityLevel, updateSecurityLevel } = useContext(WalletContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSecurity, setCurrentSecurity] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const securityOptions = [
    {
      level: 1,
      name: "Basic",
      icon: "shield-outline",
      description: "No web2 connections, only ICP-based identity.",
    },
    {
      level: 2,
      name: "Email Backup",
      icon: "email-outline",
      description: "Adds email-based recovery option.",
    },
    {
      level: 3,
      name: "Phone Backup",
      icon: "phone-outline",
      description: "Adds phone number-based recovery.",
    },
    {
      level: 4,
      name: "Multi-Factor",
      icon: "shield-check",
      description: "Combines email and phone backup.",
    },
    {
      level: 5,
      name: "Authenticator App",
      icon: "cellphone-key",
      description: "Adds TOTP-based authentication.",
    },
    {
      level: 6,
      name: "Hardware Key",
      icon: "usb",
      description: "Strongest security with hardware key support.",
    },
  ];

  useEffect(() => {
    setCurrentSecurity(
      securityOptions.find((option) => option.level === securityLevel)?.name ||
        "Basic"
    );
  }, [securityLevel]);

  const handleUpdateSecurity = useCallback(
    async (level) => {
      setIsLoading(true);
      try {
        await updateSecuritySettings({
          level,
          twoFAEnabled,
          biometricsEnabled,
        });
        Alert.alert("Success", "Security settings updated successfully");
        setModalVisible(false);
      } catch (error) {
        Alert.alert(
          "Error",
          error.message || "Failed to update security settings"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [twoFAEnabled, biometricsEnabled, updateSecuritySettings]
  );

  const SecurityOption = ({ option }) => (
    <TouchableOpacity
      style={[styles.optionContainer, { backgroundColor: colors.card }]}
      onPress={() => setModalVisible(true)}
    >
      <Icon name={option.icon} size={24} color={colors.primary} />
      <View style={styles.optionTextContainer}>
        <Text style={[styles.optionTitle, { color: colors.text }]}>
          {option.name}
        </Text>
        <Text style={[styles.optionDescription, { color: colors.text }]}>
          {option.description}
        </Text>
      </View>
      {securityLevel >= option.level && (
        <Icon
          name="check-circle"
          size={24}
          color={colors.primary}
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.primary + "22"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Animatable.View animation="fadeIn">
          <Text style={[styles.title, { color: colors.text }]}>
            Security Level: {securityLevel} - ({currentSecurity})
          </Text>
          {securityOptions.map((option) => (
            <SecurityOption key={option.level} option={option} />
          ))}
          <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color: colors.text }]}>
              Enable 2FA
            </Text>
            <Switch
              value={twoFAEnabled}
              onValueChange={setTwoFAEnabled}
              trackColor={{ false: colors.textSecondary, true: colors.primary }}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color: colors.text }]}>
              Enable Biometrics
            </Text>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: colors.textSecondary, true: colors.primary }}
            />
          </View>
          <Button
            title="Update Security Settings"
            onPress={handleUpdateSecurity}
            loading={isLoading}
            style={styles.button}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={[styles.modalView, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Update Security Level
              </Text>
              <Text style={[styles.modalDescription, { color: colors.text }]}>
                Are you sure you want to update your security level? This may
                require additional verification steps.
              </Text>
              <Button
                title="Confirm"
                onPress={() => handleSecurityUpdate(securityLevel + 1)}
                style={styles.modalButton}
              />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              />
            </View>
          </Modal>
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    padding: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionDescription: {
    fontSize: 14,
  },
  checkIcon: {
    marginLeft: 10,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalDescription: {
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    marginTop: 10,
    minWidth: 100,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  button: {
    marginTop: 20,
  },
});

export default SecurityScreen;
