import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { useEffect, useState } from "react";

const WALLET_STORAGE_KEY = "avasafe_wallet_address";

export const useMetaMask = () => {
  const { address: appKitAddress, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const address = appKitAddress ?? "";

  useEffect(() => {
    if (address) {
      localStorage.setItem(WALLET_STORAGE_KEY, address);
    } else {
      localStorage.removeItem(WALLET_STORAGE_KEY);
    }
  }, [address]);

  const connectWallet = async () => {
    setError("");
    setIsConnecting(true);
    try {
      await open();
      return new Promise<string>((resolve, reject) => {
        const check = () => {
          const addr = localStorage.getItem(WALLET_STORAGE_KEY);
          if (addr) {
            resolve(addr);
          } else {
            reject(new Error("No se pudo conectar la wallet."));
          }
        };
        setTimeout(check, 1000);
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo conectar la wallet.";
      setError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    localStorage.removeItem(WALLET_STORAGE_KEY);
  };

  return {
    address,
    error,
    isConnected: isConnected || Boolean(address),
    isConnecting,
    connectWallet,
    disconnectWallet,
  };
};
