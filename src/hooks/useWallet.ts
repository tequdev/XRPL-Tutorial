import { Client, Wallet } from "xrpl";

import { useLocalStorage } from "./utils";

export const useWallet = () => {
  const [seed, setSeed] = useLocalStorage<string | undefined>(
    "testnet-seed",
    undefined
  );
  const wallet = seed ? Wallet.fromSeed(seed) : undefined;

  const createWallet = async () => {
    const wallet = Wallet.generate();
    const client = new Client("wss://testnet.xrpl-labs.com");
    await client.connect();
    await client.fundWallet(wallet);
    setSeed(wallet.seed!);
  };

  const account = wallet
    ? {
        seed: wallet.seed!,
        address: wallet.address,
      }
    : undefined;

  return { account, createWallet };
};
