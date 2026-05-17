import { useState, useCallback } from "react";
import { useAppKit, useDisconnect } from "@reown/appkit/react";
import { signMessage, getAccount } from "@wagmi/core";
import { wagmiAdapter } from "../src/lib/appkit";
import { getNonce, walletAuthAction } from "../actions/authActions/walletAuth.action";
import { persistSession } from "../src/lib/session";

function waitForAccount(timeout = 15000): Promise<string> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const { address } = getAccount(wagmiAdapter.wagmiConfig);
      if (address) return resolve(address);
      if (Date.now() - start > timeout) return reject(new Error("No se pudo conectar la wallet."));
      setTimeout(check, 200);
    };
    check();
  });
}

export function useWalletAuth() {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState("");

  const connectAndAuth = useCallback(async () => {
    setError("");

    const { address: existing } = getAccount(wagmiAdapter.wagmiConfig);
    if (existing) {
      await disconnect();
    }

    await open();

    setIsAuthenticating(true);

    try {
      const currentAddress = await waitForAccount();

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
  }, [disconnect, open]);

  return {
    connectAndAuth,
    isAuthenticating,
    error,
  };
}
