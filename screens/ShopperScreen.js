// ShopperScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, Linking } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Zap, Gift, ShoppingCart, Coins, CreditCard, Coffee, Smartphone, Briefcase, Book, Headphones, Camera, Wifi, Globe, Pizza } from 'lucide-react';

const PartnerTile = ({ name, icon, description, discount, link, index }) => {
  const { colors } = useTheme();
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <Animated.View style={[styles.partnerTile, { opacity, transform: [{ scale }] }]}>
      <TouchableOpacity onPress={() => Linking.openURL(link)}>
        <View style={styles.partnerHeader}>
          {icon}
          <Text style={[styles.partnerName, { color: colors.text }]}>{name}</Text>
        </View>
        <Text style={[styles.partnerDescription, { color: colors.textSecondary }]}>{description}</Text>
        <Text style={[styles.partnerDiscount, { color: colors.primary }]}>{discount}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ShopperScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const partners = [
    { name: 'Fold', icon: <Image source={require('../assets/fold-logo.png')} style={styles.partnerIcon} />, description: 'Earn Bitcoin rewards with Bump Pay', discount: '10% bonus rewards for Bump users', link: 'https://foldapp.com/' },
    { name: 'Joltz', icon: <Zap color={colors.primary} size={24} />, description: 'Lightning-fast Bitcoin rewards via Bump', discount: 'Extra 5% cashback with Bump', link: 'https://joltfun.com/' },
    { name: 'Bitrefill', icon: <ShoppingCart color={colors.primary} size={24} />, description: 'Gift cards and top-ups with Bump Pay', discount: '10% off for Bump users', link: 'https://www.bitrefill.com/' },
    { name: 'Lolli', icon: <Gift color={colors.primary} size={24} />, description: 'Shop and earn Bitcoin with Bump', discount: 'Double rewards when using Bump', link: 'https://www.lolli.com/' },
    { name: 'CashApp', icon: <Image source={require('../assets/cashapp-logo.png')} style={styles.partnerIcon} />, description: 'Buy, sell, and use Bitcoin with Bump', discount: 'Fee-free purchases with Bump', link: 'https://cash.app/' },
    { name: 'Strike', icon: <Zap color={colors.primary} size={24} />, description: 'Global payments using Bump wallet', discount: '5% off Bitcoin purchases', link: 'https://strike.me/' },
    { name: 'BlockFi', icon: <Coins color={colors.primary} size={24} />, description: 'Earn interest on your Bump balance', discount: '0.5% APY bonus for Bump users', link: 'https://blockfi.com/' },
    { name: 'Coinbase', icon: <Image source={require('../assets/coinbase-logo.png')} style={styles.partnerIcon} />, description: 'Buy, sell, and store crypto with Bump', discount: 'Reduced fees for Bump transactions', link: 'https://www.coinbase.com/' },
    { name: 'Purse.io', icon: <ShoppingCart color={colors.primary} size={24} />, description: 'Shop Amazon using Bump Pay', discount: 'Extra 5% off with Bump', link: 'https://purse.io/' },
    { name: 'Moon', icon: <CreditCard color={colors.primary} size={24} />, description: 'Use Bump on any online store', discount: '3% cashback with Bump', link: 'https://paywithmoon.com/' },
    { name: 'Gyft', icon: <Gift color={colors.primary} size={24} />, description: 'Buy gift cards with Bump Pay', discount: '5% off all gift cards', link: 'https://www.gyft.com/' },
    { name: 'Bitpay', icon: <CreditCard color={colors.primary} size={24} />, description: 'Spend Bump balance anywhere', discount: 'Reduced transaction fees', link: 'https://bitpay.com/' },
    { name: 'Flexa', icon: <Smartphone color={colors.primary} size={24} />, description: 'Spend Bump in stores', discount: '2% cashback at select retailers', link: 'https://flexa.network/' },
    { name: 'Coingate', icon: <Globe color={colors.primary} size={24} />, description: 'Accept Bump payments globally', discount: '20% off merchant fees', link: 'https://coingate.com/' },
    { name: 'Travala', icon: <Briefcase color={colors.primary} size={24} />, description: 'Book travel with Bump Pay', discount: '5% off bookings with Bump', link: 'https://www.travala.com/' },
    { name: 'Overstock', icon: <ShoppingCart color={colors.primary} size={24} />, description: 'Shop with Bump Pay', discount: 'Free shipping on orders over $50', link: 'https://www.overstock.com/' },
    { name: 'Newegg', icon: <Smartphone color={colors.primary} size={24} />, description: 'Tech shopping with Bump Pay', discount: '3% off electronics', link: 'https://www.newegg.com/' },
    { name: 'AT&T', icon: <Wifi color={colors.primary} size={24} />, description: 'Pay phone bills with Bump', discount: '$15 off your first Bump payment', link: 'https://www.att.com/' },
    { name: 'ExpressVPN', icon: <Globe color={colors.primary} size={24} />, description: 'Privacy with Bump payments', discount: '3 months free with annual plan', link: 'https://www.expressvpn.com/' },
    { name: 'Namecheap', icon: <Globe color={colors.primary} size={24} />, description: 'Domain registration with Bump', discount: '10% off domain registrations', link: 'https://www.namecheap.com/' },
    { name: 'Dish Network', icon: <Wifi color={colors.primary} size={24} />, description: 'Pay TV bills with Bump', discount: 'First month free for new customers', link: 'https://www.dish.com/' },
    { name: 'CheapAir', icon: <Briefcase color={colors.primary} size={24} />, description: 'Book flights with Bump Pay', discount: '$25 off your first flight', link: 'https://www.cheapair.com/' },
    { name: 'Menufy', icon: <Pizza color={colors.primary} size={24} />, description: 'Order food with Bump Pay', discount: 'Free delivery on your first order', link: 'https://www.menufy.com/' },
    { name: 'eGifter', icon: <Gift color={colors.primary} size={24} />, description: 'Buy gift cards with Bump Pay', discount: '3% bonus on gift card purchases', link: 'https://www.egifter.com/' },
    { name: 'Twitch', icon: <Camera color={colors.primary} size={24} />, description: 'Support streamers with Bump', discount: '10% off first subscription', link: 'https://www.twitch.tv/' },
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
        <Text style={styles.title}>Shop with Bump Pay</Text>
        <Text style={styles.description}>
          Use Bump Pay for Bitcoin, Lightning, and Litecoin payments with our partners. Enjoy exclusive discounts and rewards!
        </Text>
        <View style={styles.partnerGrid}>
          {partners.map((partner, index) => (
            <PartnerTile key={index} {...partner} index={index} />
          ))}
        </View>
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
  partnerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  partnerTile: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  partnerIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  partnerDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  partnerDiscount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ShopperScreen;