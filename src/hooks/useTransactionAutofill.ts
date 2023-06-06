import { Client, Transaction } from "xrpl";


const client = new Client("wss://testnet.xrpl-labs.com");
export const useTransactionAutofill = () => {
  const autofill = async (txjson: Record<string, unknown>) => {
    await client.connect()
    const tx = await client.autofill(txjson as unknown as Transaction);
    return tx;
  };
  return autofill
}
