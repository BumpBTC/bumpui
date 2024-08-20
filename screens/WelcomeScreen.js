import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import Button from '../components/Button';
import LoginModal from '../components/LoginModal';
import { useTheme } from '../contexts/ThemeContext';

const WelcomeScreen = ({ navigation }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const { colors } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={{ ...styles.content, opacity: fadeAnim }}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={[styles.title, { color: colors.text }]}>Bump-to-Pay</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>The fastest and easiest way to use Bitcoin.</Text>
        <Button title="Create Account" onPress={() => navigation.navigate('Signup')} />
        <Button
          title="Login"
          onPress={() => setLoginModalVisible(true)}
          style={styles.loginButton}
          textStyle={{ color: colors.primary }}
        />
      </Animated.View>
      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'transparent',
    marginTop: 10,
  },
});

export default WelcomeScreen;