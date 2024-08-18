import { StyleSheet, Platform } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    color: "#333",
    fontFamily: 'ComicNeue_400Regular',
  },
  primaryButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'ComicNeue_400Regular',
  },
  secondaryButton: {
    backgroundColor: "#4682B4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'ComicNeue_400Regular',
  },
});

export default globalStyles;
