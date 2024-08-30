import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PriceTicker = ({ prices }) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -1000,
        duration: 10000,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const renderPrices = () => {
    return prices.map((price, index) => (
      <Text key={index} style={styles.priceText}>
        {price.symbol}: ${price.price.toFixed(2)} |
      </Text>
    ));
  };

  return (
    <LinearGradient
      colors={['#000', '#111']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.tickerContainer,
          { transform: [{ translateX: scrollX }] },
        ]}
      >
        {renderPrices()}
        {renderPrices()}
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    overflow: 'hidden',
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  priceText: {
    color: '#FF6600',
    fontSize: 14,
    fontFamily: 'Courier',
    marginRight: 20,
  },
});

export default PriceTicker;