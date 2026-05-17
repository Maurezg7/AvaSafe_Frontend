import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { avalancheFuji } from "viem/chains";
import { http } from "viem";
import type { AppKitNetwork } from "@reown/appkit-common";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "";
const rpcUrl = import.meta.env.VITE_AVALANCHE_RPC_URL ?? "https://api.avax-test.network/ext/bc/C/rpc";

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [avalancheFuji as AppKitNetwork];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  transports: {
    [avalancheFuji.id]: http(rpcUrl),
  },
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
