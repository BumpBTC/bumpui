import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SecurityBadge = ({ level }) => {
  const getColor = () => {
    switch (level) {
      case 'low':
        return '#FF6B6B';
      case 'medium':
        return '#FFD93D';
      case 'high':
        return '#6BCB77';
      default:
        return '#B2B2B2';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'low':
        return 'shield-alert';
      case 'medium':
        return 'shield-half-full';
      case 'high':
        return 'shield-check';
      default:
        return 'shield-outline';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getColor() }]}>
      <Icon name={getIcon()} size={20} color="#FFFFFF" />
      <Text style={styles.text}>{level.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 15,
    marginVertical: 10,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default SecurityBadge;