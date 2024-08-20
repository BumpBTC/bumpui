import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "react-error-boundary";
import AppNavigator from "./navigation/AppNavigator";
import { WalletProvider } from "./contexts/WalletContext";
import { ContactProvider } from "./contexts/ContactContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorFallback from "./components/ErrorFallback";

const ErrorFallbackComponent = ({ error, resetErrorBoundary }) => (
  <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
    <SafeAreaProvider>
      <ThemeProvider>
        <WalletProvider>
          <ContactProvider>
            {/* <NavigationContainer> */}
              <AppNavigator />
            {/* </NavigationContainer> */}
          </ContactProvider>
        </WalletProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  </ErrorBoundary>
);

export default App;
