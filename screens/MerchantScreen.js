// MerchantScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Linking } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Info, CreditCard, Bitcoin, Zap, AppleIcon, DollarSign, Globe, ShoppingBag, Smartphone } from 'lucide-react';

const IntegrationOption = ({ title, icon, description, infoText, link, index }) => {
  const { colors } = useTheme();
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Animated.View style={[styles.integrationOption, { opacity, transform: [{ translateY }] }]}>
      <TouchableOpacity onPress={() => Linking.openURL(link)}>
        {icon}
        <Text style={[styles.integrationTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.integrationDescription, { color: colors.textSecondary }]}>{description}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.infoButton} onPress={() => alert(infoText)}>
        <Info color={colors.primary} size={20} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const MerchantScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const integrations = [
    { title: "Square", icon: <CreditCard color={colors.primary} size={24} />, description: "Enable Bump Pay for Square POS systems.", infoText: "Integrate Bump wallet as a payment option in Square's checkout flow.", link: "https://squareup.com/us/en/partners" },
    { title: "Bitcoin Wallets", icon: <Bitcoin color={colors.primary} size={24} />, description: "Connect Bump with popular Bitcoin wallets.", infoText: "Allow customers to pay directly from their preferred Bitcoin wallets to your Bump account.", link: "https://bitcoin.org/en/choose-your-wallet" },
    { title: "Lightning Network", icon: <Zap color={colors.primary} size={24} />, description: "Accept instant Bump payments via Lightning.", infoText: "Enable Lightning Network payments through Bump for near-instant, low-fee transactions.", link: "https://lightning.network/" },
    { title: "Apple Pay", icon: <AppleIcon color={colors.primary} size={24} />, description: "Integrate Bump with Apple Pay for seamless checkout.", infoText: "Allow customers to use Bump wallet funds through Apple Pay's payment system.", link: "https://www.apple.com/apple-pay/" },
    { title: "Stripe", icon: <DollarSign color={colors.primary} size={24} />, description: "Add Bump as a payment method in Stripe.", infoText: "Integrate Bump wallet as a payment option in your Stripe-powered checkout.", link: "https://stripe.com/partners" },
    { title: "BTCPay Server", icon: <Bitcoin color={colors.primary} size={24} />, description: "Self-host Bump payments with BTCPay Server.", infoText: "Use BTCPay Server to process Bump wallet payments directly, without intermediaries.", link: "https://btcpayserver.org/" },
    { title: "OpenNode", icon: <Zap color={colors.primary} size={24} />, description: "Process Bump payments via OpenNode.", infoText: "Leverage OpenNode's platform to accept Bitcoin and Lightning payments through Bump.", link: "https://www.opennode.com/" },
    { title: "Shopify", icon: <ShoppingBag color={colors.primary} size={24} />, description: "Add Bump Pay to your Shopify store.", infoText: "Integrate Bump wallet as a payment option in your Shopify store's checkout process.", link: "https://www.shopify.com/payment-gateways" },
    { title: "WooCommerce", icon: <ShoppingBag color={colors.primary} size={24} />, description: "Enable Bump payments for WordPress stores.", infoText: "Add Bump wallet as a payment method in your WooCommerce-powered WordPress store.", link: "https://woocommerce.com/product-category/woocommerce-extensions/" },
    { title: "Adyen", icon: <Globe color={colors.primary} size={24} />, description: "Integrate Bump with Adyen's global platform.", infoText: "Use Adyen's payment platform to process Bump wallet transactions globally.", link: "https://www.adyen.com/partners" },
  ];

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Integrate Bump with Your Business</Text>
        <Text style={styles.description}>
          Accept Bitcoin, Lightning, and Litecoin payments seamlessly with Bump Pay integrations.
        </Text>
        {integrations.map((integration, index) => (
          <IntegrationOption key={index} {...integration} index={index} />
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  integrationOption: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  integrationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  integrationDescription: {
    marginTop: 5,
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default MerchantScreen;