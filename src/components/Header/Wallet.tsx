import { useWallet } from "@/hooks/useWallet"

export const Wallet = () => {
  const { account, createWallet } = useWallet();
  
  if (!account) {
    return <button onClick={createWallet}>Create Wallet</button>;
  }
  return <div>{account.address.slice(0, 8)}...</div>;
}
