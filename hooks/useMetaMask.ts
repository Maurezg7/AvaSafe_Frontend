import { useEffect, useState } from "react";

const WALLET_STORAGE_KEY = "avasafe_wallet_address";

export const useMetaMask = () => {
  const [address, setAddress] = useState(() => localStorage.getItem(WALLET_STORAGE_KEY) ?? "");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const loadCurrentAccount = async () => {
      if (!window.ethereum) return;
      const accounts = await window.ethereum.request<string[]>({ method: "eth_accounts" });
      const currentAddress = accounts[0] ?? "";
      setAddress(currentAddress);
      if (currentAddress) {
        localStorage.setItem(WALLET_STORAGE_KEY, currentAddress);
      } else {
        localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    };

    loadCurrentAccount().catch(() => {
      localStorage.removeItem(WALLET_STORAGE_KEY);
      setAddress("");
    });

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = (args[0] as string[]) ?? [];
      const currentAddress = accounts[0] ?? "";
      setAddress(currentAddress);
      if (currentAddress) {
        localStorage.setItem(WALLET_STORAGE_KEY, currentAddress);
      } else {
        localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    };

    window.ethereum?.on?.("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connectWallet = async () => {
    setError("");

    if (!window.ethereum) {
      const message = "Necesitas MetaMask instalado para continuar.";
      setError(message);
      throw new Error(message);
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request<string[]>({ method: "eth_requestAccounts" });
      const currentAddress = accounts[0];

      if (!currentAddress) {
        throw new Error("No se pudo conectar la wallet.");
      }

      setAddress(currentAddress);
      localStorage.setItem(WALLET_STORAGE_KEY, currentAddress);
      return currentAddress;
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo conectar MetaMask.";
      setError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    address,
    error,
    isConnected: Boolean(address),
    isConnecting,
    connectWallet,
  };
};
