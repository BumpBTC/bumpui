import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;

import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api";
import { getWalletInfo } from "../services/api";
import { removeToken } from "../services/auth";
import { getToken } from "../services/auth";
import * as bip39 from "bip39";
// import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from "bip32";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [ltcAddress, setLtcAddress] = useState("");
  const [taprootAddress, setTaprootAddress] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [enableTaproot, setEnableTaproot] = useState(false);
  const [securityLevel, setSecurityLevel] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);
  const [channelCreationProgress, setChannelCreationProgress] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");

  const checkLoginStatus = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  }, []);

  const fetchWalletData = useCallback(async () => {
    if (isLoggedIn) {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getWalletInfo();
        setWallets(data.wallets || []);
        setTransactions(data.transactions || []);
        setSelectedCrypto(data.activeWallet || null);
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
        setError(error.response?.data?.error || "Failed to fetch wallet data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoggedIn]);

  const login = async (token) => {
    await AsyncStorage.setItem('userToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsLoggedIn(true);
    fetchWalletData();
  };


  const fetchWalletInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/wallet/info");
      setWallets(response.data.wallets);
      setTransactions(response.data.transactions);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch wallet info:", error);
      setError(error.response?.data?.error || "Failed to fetch wallet info");
      setIsLoading(false);
    }
  }, []);

  const fetchExchangeRates = useCallback(async () => {
    try {
      const response = await api.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin&vs_currencies=usd"
      );
      setExchangeRates(response.data);
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
    }
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      delete api.defaults.headers.common['Authorization'];
      await removeToken();
      setIsLoggedIn(false);
      setWallets([]);
      setTransactions([]);
      setError(null);
      // You might want to reset other state variables here
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const setActiveWallet = async (type, walletId) => {
    try {
      const response = await api.post('/wallet/set-active', { type, walletId });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error('Failed to set active wallet:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkLoginStatus();
    fetchWalletData();
    // generateAddresses();
    fetchExchangeRates();
    calculateSecurityScore(securityLevel);
    const interval = setInterval(fetchExchangeRates, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [fetchWalletData, fetchExchangeRates]);

  const convertAmount = useCallback(
    (amount, fromCurrency, toCurrency) => {
      if (fromCurrency === toCurrency) return amount;
      if (fromCurrency === "USD") {
        if (toCurrency === "lightning") {
          return (amount * 100000000) / exchangeRates.bitcoin; // Convert to sats
        }
        return amount / exchangeRates[toCurrency];
      }
      if (toCurrency === "USD") {
        if (fromCurrency === "lightning") {
          return (amount * exchangeRates.bitcoin) / 100000000; // Convert from sats
        }
        return amount * exchangeRates[fromCurrency];
      }
      // Convert between cryptocurrencies
      const usdAmount = convertAmount(amount, fromCurrency, "USD");
      return convertAmount(usdAmount, "USD", toCurrency);
    },
    [exchangeRates]
  );

  const createWallet = async (type) => {
    try {
      setIsLoading(true);
      const response = await api.post('/wallet/create', { type: 'bitcoin' });
      setWallet(response.data.wallet);
      await fetchWalletData();
      // Automatically set the new wallet as active
      await setActiveWallet(type, response.data.wallet.id);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw error;
    }
  };

  // const generateAddresses = useCallback(async () => {
  //   try {
  //     const response = await api.post("/wallet/generate-addresses");
  //     setBtcAddress(response.data.btcAddress);
  //     setLtcAddress(response.data.ltcAddress);
  //     setTaprootAddress(response.data.taprootAddress);
  //     setMnemonic(response.data.mnemonic);
  //   } catch (error) {
  //     console.error("Error generating addresses:", error);
  //   }
  // }, []);

  const sendBitcoin = async (toAddress, amount) => {
    try {
      setIsLoading(true);
      const response = await api.post("/wallet/send-bitcoin", {
        toAddress,
        amount,
      });
      await fetchWalletInfo(); // Refresh wallet info after sending
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error("Failed to send Bitcoin:", error);
      setError(error.response?.data?.error || "Failed to send Bitcoin");
      setIsLoading(false);
      throw error;
    }
  };

  const sendLightning = async (paymentRequest) => {
    try {
      const response = await api.post("/wallet/send-lightning", {
        paymentRequest,
      });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to send Lightning payment:", error);
      throw error;
    }
  };

  const sendTransaction = useCallback(
    async (paymentType, toAddress, amount) => {
      try {
        const response = await api.post(`/wallet/send-${paymentType}`, {
          toAddress,
          amount: parseFloat(amount),
        });
        await fetchWalletData();
        return response.data;
      } catch (error) {
        console.error(`Failed to send ${paymentType}:`, error);
        throw error;
      }
    },
    [fetchWalletData]
  );

  const payLightningInvoice = async (paymentRequest) => {
    try {
      const response = await api.post("/lightning/pay-invoice", {
        paymentRequest,
      });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to pay Lightning invoice:", error);
      throw error;
    }
  };

  const createLightningWallet = async () => {
    try {
      const response = await api.post("/lightning/create-wallet");
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to create Lightning wallet:", error);
      throw error;
    }
  };

  const createLightningChannel = async (nodeUri, amount) => {
    try {
      const response = await api.post("/lightning/create-channel", {
        nodeUri,
        amount,
        channelName,
      });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to create Lightning channel:", error);
      throw error;
    }
  };

  const getChannelConfigurations = async () => {
    try {
      const response = await api.get("/lightning/channel-configurations");
      return response.data;
    } catch (error) {
      console.error("Failed to get channel configurations:", error);
      throw error;
    }
  };

  const updateChannelConfiguration = async (configId, updates) => {
    try {
      const response = await api.put(
        `/lightning/channel-configurations/${configId}`,
        updates
      );
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to update channel configuration:", error);
      throw error;
    }
  };

  const deleteChannelConfiguration = async (configId) => {
    try {
      await api.delete(`/lightning/channel-configurations/${configId}`);
      await fetchWalletData();
    } catch (error) {
      console.error("Failed to delete channel configuration:", error);
      throw error;
    }
  };

  const importLightningWallet = async (mnemonic) => {
    try {
      const response = await api.post("/lightning/import-wallet", { mnemonic });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to import Lightning wallet:", error);
      throw error;
    }
  };

  const createLightningInvoice = async (amount, memo) => {
    try {
      const response = await api.post("/lightning/create-invoice", {
        amount,
        memo,
      });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to create Lightning invoice:", error);
      throw error;
    }
  };

  const openLightningChannel = async (nodeUri, amount) => {
    try {
      const response = await api.post("/lightning/open-channel", {
        nodeUri,
        amount,
      });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to open Lightning channel:", error);
      throw error;
    }
  };

  const closeLightningChannel = async (channelId) => {
    try {
      const response = await api.post("/lightning/close-channel", {
        channelId,
      });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to close Lightning channel:", error);
      throw error;
    }
  };

  const importWallet = async (mnemonic, type) => {
    try {
      const response = await api.post("/wallet/import", { mnemonic, type });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to import wallet:", error);
      throw error;
    }
  };

  const updateSecurityLevel = async (level) => {
    try {
      const response = await api.post("/wallet/update-security", { level });
      setSecurityLevel(level);
      calculateSecurityScore(level);
      return response.data;
    } catch (error) {
      console.error("Failed to update security level:", error);
      throw error;
    }
  };

  const calculateSecurityScore = (level) => {
    const securityOptions = [
      { level: 1, score: 100 },
      { level: 2, score: 100 },
      { level: 3, score: 100 },
      { level: 4, score: 150 },
      { level: 5, score: 150 },
      { level: 6, score: 200 },
      { level: 7, score: 200 },
    ];

    const score = securityOptions.reduce((total, option) => {
      return total + (level >= option.level ? option.score : 0);
    }, 0);

    setSecurityScore(score);
  };

  const getLightningBalance = async () => {
    try {
      const response = await api.get("/lightning/balance");
      return response.data.balance;
    } catch (error) {
      console.error("Failed to get Lightning balance:", error);
      throw error;
    }
  };

  const getLightningTransactionHistory = async () => {
    try {
      const response = await api.get("/lightning/transaction-history");
      return response.data;
    } catch (error) {
      console.error("Failed to get Lightning transaction history:", error);
      throw error;
    }
  };

  const getTransactionHistory = async (type) => {
    try {
      const response = await api.get(`/wallet/transaction-history/${type}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get transaction history:", error);
      throw error;
    }
  };

  const createNfcChannel = async () => {
    try {
      const response = await api.post("/lightning/create-nfc-channel");
      return response.data;
    } catch (error) {
      console.error("Failed to create NFC channel:", error);
      throw error;
    }
  };

  const getNfcChannelBalance = async () => {
    try {
      const response = await api.get("/lightning/nfc-channel-balance");
      return response.data.balance;
    } catch (error) {
      console.error("Failed to get NFC channel balance:", error);
      throw error;
    }
  };

  const createNfcInvoice = async (amount, description) => {
    try {
      const response = await api.post("/lightning/create-nfc-invoice", { amount, description });
      return response.data;
    } catch (error) {
      console.error("Failed to create NFC invoice:", error);
      throw error;
    }
  };

  const payNfcInvoice = async (paymentRequest) => {
    try {
      const response = await api.post("/lightning/pay-nfc-invoice", { paymentRequest });
      return response.data;
    } catch (error) {
      console.error("Failed to pay NFC invoice:", error);
      throw error;
    }
  };


  const backupWallet = async () => {
    try {
      const response = await api.get("/wallet/backup");
      return response.data;
    } catch (error) {
      console.error("Failed to backup wallet:", error);
      throw error;
    }
  };

  const restoreWallet = async (backupData) => {
    try {
      const response = await api.post("/wallet/restore", { backupData });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to restore wallet:", error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        wallets,
        setWallets,
        transactions,
        isLoading,
        isLoggedIn,
        setIsLoggedIn,
        error,
        fetchWalletData,
        sendBitcoin,
        sendTransaction,
        sendLightning,
        createWallet,
        setActiveWallet,
        createLightningWallet,
        createLightningChannel,
        importLightningWallet,
        payLightningInvoice,
        createLightningInvoice,
        payLightningInvoice,
        openLightningChannel,
        closeLightningChannel,
        getLightningBalance,
        getLightningTransactionHistory,
        getChannelConfigurations,
        updateChannelConfiguration,
        deleteChannelConfiguration,
        channelCreationProgress,
        selectedCrypto,
        setSelectedCrypto,
        fetchWalletInfo,
        balance,
        login,
        logout,
        checkLoginStatus,
        // generateAddresses,
        btcAddress,
        ltcAddress,
        taprootAddress,
        mnemonic,
        enableTaproot,
        setEnableTaproot,
        importWallet,
        securityLevel,
        updateSecurityLevel,
        securityScore,
        getTransactionHistory,
        convertAmount,
        exchangeRates,
        createNfcChannel,
        getNfcChannelBalance,
        createNfcInvoice,
        payNfcInvoice,
        backupWallet,
        restoreWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
