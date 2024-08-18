import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { getToken } from "../services/auth";
import * as bip39 from "bip39";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [btcAddress, setBtcAddress] = useState("");
  const [ltcAddress, setLtcAddress] = useState("");
  const [taprootAddress, setTaprootAddress] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [enableTaproot, setEnableTaproot] = useState(false);
  const [securityLevel, setSecurityLevel] = useState(1);

  const fetchWalletData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        setError("No token found. Please log in.");
        setIsLoading(false);
        return;
      }
      const response = await api.get("/wallet/info");
      setWallets(response.data.wallets || []);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      setError(
        error.response?.data?.error ||
          "Failed to fetch wallet data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
    generateAddresses();
  }, [fetchWalletData]);

  const generateAddresses = async () => {
    try {
      const newMnemonic = bip39.generateMnemonic();
      setMnemonic(newMnemonic);

      const response = await api.post("/wallet/generateAddresses", {
        mnemonic: newMnemonic,
      });
      setBtcAddress(response.data.btcAddress);
      setLtcAddress(response.data.ltcAddress);
      setTaprootAddress(response.data.taprootAddress);
    } catch (error) {
      console.error("Error generating addresses:", error);
    }
  };

  const sendBitcoin = async (toAddress, amount) => {
    try {
      const response = await api.post("/wallet/send-bitcoin", {
        toAddress,
        amount,
      });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error("Failed to send Bitcoin:", error);
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

  const sendTransaction = async (type, toAddress, amount) => {
    try {
      const response = await api.post(`/wallet/send-${type}`, {
        toAddress,
        amount,
      });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error(`Failed to send ${type}:`, error);
      throw error;
    }
  };

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
      const response = await api.post('/lightning/create-wallet');
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error('Failed to create Lightning wallet:', error);
      throw error;
    }
  };

  const importLightningWallet = async (mnemonic) => {
    try {
      const response = await api.post('/lightning/import-wallet', { mnemonic });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error('Failed to import Lightning wallet:', error);
      throw error;
    }
  };

  const createLightningInvoice = async (amount, memo) => {
    try {
      const response = await api.post("/lightning/create-invoice", {
        amount,
        memo,
      });
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
      const response = await api.post('/wallet/import', { mnemonic, type });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error('Failed to import wallet:', error);
      throw error;
    }
  };

  const updateSecurityLevel = async (level) => {
    try {
      const response = await api.post('/wallet/update-security', { level });
      setSecurityLevel(response.data.securityLevel);
      return response.data;
    } catch (error) {
      console.error('Failed to update security level:', error);
      throw error;
    }
  };

  const getTransactionHistory = async (type) => {
    try {
      const response = await api.get(`/wallet/transaction-history/${type}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      throw error;
    }
  };

  const backupWallet = async () => {
    try {
      const response = await api.get('/wallet/backup');
      return response.data;
    } catch (error) {
      console.error('Failed to backup wallet:', error);
      throw error;
    }
  };

  const restoreWallet = async (backupData) => {
    try {
      const response = await api.post('/wallet/restore', { backupData });
      await fetchWalletData();
      return response.data;
    } catch (error) {
      console.error('Failed to restore wallet:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        transactions,
        fetchWalletData,
        isLoading,
        error,
        sendBitcoin,
        sendTransaction,
        sendLightning,
        createLightningWallet,
        importLightningWallet,
        payLightningInvoice,
        createLightningInvoice,
        payLightningInvoice,
        openLightningChannel,
        closeLightningChannel,
        balance,
        btcAddress,
        ltcAddress,
        taprootAddress,
        mnemonic,
        enableTaproot,
        setEnableTaproot,
        importWallet,
        securityLevel,
        updateSecurityLevel,
        getTransactionHistory,
        backupWallet,
        restoreWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
