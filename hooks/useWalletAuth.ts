import { useState, useCallback } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { signMessage } from "@wagmi/core";
import { wagmiAdapter } from "../src/lib/appkit";
import { getNonce, walletAuthAction } from "../actions/authActions/walletAuth.action";
import { persistSession } from "../src/lib/session";

export function useWalletAuth() {
  const { address: appKitAddress, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState("");

  const address = appKitAddress ?? "";

  const connectAndAuth = useCallback(async () => {
    setError("");

    if (!isConnected) {
      await open();
    }

    const currentAddress = appKitAddress ?? localStorage.getItem("avasafe_wallet_address") ?? "";
    if (!currentAddress) {
      throw new Error("No se pudo conectar la wallet.");
    }

    setIsAuthenticating(true);

    try {
      const { message } = await getNonce(currentAddress);

      const signature = await signMessage(wagmiAdapter.wagmiConfig, {
        message,
      });

      const result = await walletAuthAction({
        address: currentAddress,
        signature,
      });

      const token = result.token;
      if (!token) throw new Error("No se recibió token del servidor");

      persistSession({ token, address: currentAddress });
      return token;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de autenticación";
      setError(msg);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, [isConnected, appKitAddress, open]);

  return {
    address,
    isConnected,
    isAuthenticating,
    error,
    connectAndAuth,
  };
}
