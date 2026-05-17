import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { avalancheFuji } from "viem/chains";
import type { AppKitNetwork } from "@reown/appkit-common";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "";

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [avalancheFuji as AppKitNetwork];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

createAppKit({
  networks,
  adapters: [wagmiAdapter],
  projectId,
  metadata: {
    name: "AvaSafe",
    description: "Decentralized marketplace on Avalanche",
    url: "https://avasafe.app",
    icons: ["/AvaSafe_Logo.png"],
  },
  themeMode: "dark",
  features: {
    analytics: false,
  },
});

export { wagmiAdapter };
