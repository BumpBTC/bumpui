import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const defaultColors = {
  background: '#FFFFFF',
  text: '#000000',
  error: '#FF0000',
  primary: '#1E90FF',
};

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  let colors;
  try {
    colors = useTheme().colors;
  } catch (e) {
    console.warn('ThemeContext not available, using default colors');
    colors = defaultColors;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Oops! Something went wrong</Text>
      <Text style={[styles.errorMessage, { color: colors.error }]}>{error.message}</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={resetErrorBoundary}
      >
        <Text style={[styles.buttonText, { color: colors.background }]}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorFallback;