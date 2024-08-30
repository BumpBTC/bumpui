import React, { useState, useContext, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Badge } from 'react-native-elements';
import { useTheme } from "../contexts/ThemeContext";
import { WalletContext } from "../contexts/WalletContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../components/Button";
import Input from "../components/Input";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from 'react-native-progress';

const SecurityScreen = ({ }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { securityLevel, updateSecurityLevel } = useContext(WalletContext);
  const { securitySettings, updateSecuritySettings } = useContext(WalletContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSecurity, setCurrentSecurity] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const securityOptions = [
    {
      level: 1,
      name: "Blockchain Credentials",
      icon: "shield-outline",
      description: "Set up your blockchain-based identity credentials.",
      screenName: "BlockchainCredentials"
    },
    {
      level: 2,
      name: "Email Backup",
      icon: "email-outline",
      description: "Add email-based recovery option.",
      screenName: "EmailBackup"
    },
    {
      level: 3,
      name: "Phone Backup",
      icon: "phone-outline",
      description: "Add phone number-based recovery.",
      screenName: "PhoneBackup"
    },
    {
      level: 4,
      name: "Multi-Factor Authentication",
      icon: "shield-check",
      description: "Set up MFA for enhanced security.",
      screenName: "MFA"
    },
    {
      level: 5,
      name: "Authenticator App",
      icon: "cellphone-key",
      description: "Add TOTP-based authentication.",
      screenName: "Authenticator"
    },
    {
      level: 6,
      name: "Hardware Key",
      icon: "usb",
      description: "Set up hardware key for strongest security.",
      screenName: "HardwareKey"
    },
    {
      level: 7,
      name: "Biometrics",
      icon: "fingerprint",
      description: "Enable biometric authentication.",
      screenName: "Biometrics"
    }
  ];

  const blockchainCredentials = [
    { name: 'ICP', icon: 'infinity', color: '#3B00B9', completed: true },
    { name: 'Bitcoin (Ordinal)', icon: 'bitcoin', color: '#F7931A', completed: false },
    { name: 'Stacks', icon: 'alpha-s-box', color: '#5546FF', completed: false },
  ];

  const recommendedNextStep = useMemo(() => {
    return securityOptions.find(option => option.level > securityLevel) || null;
  }, [securityLevel]);


  const securityScore = useMemo(() => {
    return securityOptions.reduce((score, option) => {
      return score + (securityLevel >= option.level ? option.score : 0);
    }, 0);
  }, [securityLevel]);

  const getSecurityColor = (level) => {
    if (level >= 6) return colors.success;
    if (level >= 3) return colors.warning;
    return colors.error;
  };

  const getBadgeStatus = (level) => {
    if (level >= 6) return 'success';
    if (level >= 3) return 'warning';
    return 'error';
  };

  
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
        await updateSecurityLevel(level);
        setSecurityLevel(level);
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
    [twoFAEnabled, biometricsEnabled, updateSecurityLevel, updateSecuritySettings]
  );

  const renderBlockchainCredential = (credential) => (
    <View key={credential.name} style={styles.credentialContainer}>
      <Icon name={credential.icon} size={24} color={credential.color} />
      <Text style={[styles.credentialText, { color: colors.text }]}>{credential.name}</Text>
      <Icon 
        name={credential.completed ? "check-circle" : "circle-outline"} 
        size={24} 
        color={credential.completed ? colors.success : colors.primary} 
      />
    </View>
  );

  const renderSecurityOption = (option) => (
    <TouchableOpacity
      key={option.level}
      style={[styles.optionContainer, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate(option.screenName)}
    >
      <Icon 
        name={option.icon} 
        size={24} 
        color={getSecurityColor(option.level)} 
      />
      <View style={styles.optionTextContainer}>
        <Text style={[styles.optionTitle, { color: colors.text }]}>{option.name}</Text>
        <Progress.Bar 
          progress={securityLevel >= option.level ? 1 : 0} 
          width={null} 
          color={getSecurityColor(option.level)}
        />
      </View>
    </TouchableOpacity>
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

          <Animatable.View animation="fadeIn">
          <Text style={[styles.title, { color: colors.text }]}>
            Credential Management
          </Text>

          <Text style={[styles.credentialText, { color: colors.text }]}>
            Security Level: {securityLevel} - ({currentSecurity})
            {/* {securityOptions[securityLevel].name} */}
            <Badge
            value={securityLevel}
            status={getBadgeStatus(securityLevel)}
            containerStyle={styles.badgeContainer}
          />
          </Text>

          {recommendedNextStep && (
          <View style={styles.recommendationContainer}>
            <Text style={[styles.recommendationTitle, { color: colors.text }]}>Recommended Next Step</Text>
            <TouchableOpacity
              style={[styles.recommendationButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate(recommendedNextStep.screenName)}
            >
              <Text style={[styles.recommendationButtonText, { color: colors.background }]}>
                Setup {recommendedNextStep.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}

          {securityOptions.map(renderSecurityOption)}
          <View style={styles.blockchainCredentialsContainer}>
            <Text style={[styles.blockchainCredentialsTitle, { color: colors.text }]}>
              Blockchain Credentials
            </Text>
            {blockchainCredentials.map(renderBlockchainCredential)}
          </View>
        </Animatable.View>

          {/* <Button
            title="Update Security Settings"
            onPress={handleUpdateSecurity}
            loading={isLoading}
            style={styles.button}
          /> */}
          <Modal
            animationType="slide"
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
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationContainer: {
    marginVertical: 20,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  recommendationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    marginBottom: 5,
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
  blockchainCredentialsContainer: {
    marginTop: 20,
    padding: 20,
  },
  blockchainCredentialsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  credentialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  credentialText: {
    fontSize: 16,
    marginLeft: 10,
  },
  badgeContainer: {
    marginLeft: 10,
    fontSize: 24,
    padding: 6,
  },
});

export default SecurityScreen;
