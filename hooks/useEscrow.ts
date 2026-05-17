import { useState, useCallback } from "react";
import { writeContract, simulateContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseAbi } from "viem";
import { wagmiAdapter } from "../src/lib/appkit";

const CONTRACT_ADDRESS = import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS as `0x${string}`;

const ESCROW_ABI = parseAbi([
  "function createTrade(address seller, string productId) returns (uint256)",
  "function fundTrade(uint256 tradeId) payable",
  "function confirmDelivery(uint256 tradeId)",
  "function getTrade(uint256 tradeId) view returns (address seller, address buyer, uint256 amount, string productId, uint256 createdAt, uint8 status)",
]);

export function useEscrow() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const createTrade = useCallback(async (seller: string, productId: string): Promise<number> => {
    setIsProcessing(true);
    setError("");
    try {
      const { result } = await simulateContract(wagmiAdapter.wagmiConfig, {
        abi: ESCROW_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "createTrade",
        args: [seller as `0x${string}`, productId],
      });

      const txHash = await writeContract(wagmiAdapter.wagmiConfig, {
        abi: ESCROW_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "createTrade",
        args: [seller as `0x${string}`, productId],
      });

      await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: txHash });
      return Number(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear trade";
      setError(msg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const fundTrade = useCallback(async (tradeId: number, amountAvax: string): Promise<string> => {
    setIsProcessing(true);
    setError("");
    try {
      const txHash = await writeContract(wagmiAdapter.wagmiConfig, {
        abi: ESCROW_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "fundTrade",
        args: [BigInt(tradeId)],
        value: BigInt(Math.floor(parseFloat(amountAvax) * 1e18)),
      });

      await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: txHash });
      return txHash;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al depositar fondos";
      setError(msg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const confirmDelivery = useCallback(async (tradeId: number): Promise<string> => {
    setIsProcessing(true);
    setError("");
    try {
      const txHash = await writeContract(wagmiAdapter.wagmiConfig, {
        abi: ESCROW_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "confirmDelivery",
        args: [BigInt(tradeId)],
      });

      await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: txHash });
      return txHash;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al confirmar entrega";
      setError(msg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    createTrade,
    fundTrade,
    confirmDelivery,
    isProcessing,
    error,
  };
}
