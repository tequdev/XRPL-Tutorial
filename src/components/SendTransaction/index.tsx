import { TransactionCodeEditor } from "@/components/TransactionEditor";
import { useWallet } from "@/hooks/useWallet";

/**
 * Send Transaction
 */
export const SendTransaction = () => {
  const { account } = useWallet()
  
  const checkCode = (tx: Record<string, unknown>) => {
    if (tx.Amount && tx.Amount === '1000000') {
      // OK
      alert('success')
    } else {
      // NG
    }
  }
  
  return (
    <div>
      <TransactionCodeEditor
        validTransactionType="AccountSet"
        json={{
          TransactionType: "AccountSet",
          Account: account?.address || "",
        }}
        onSubmit={(tx) => checkCode(tx as unknown as Record<string, unknown>)}
      />
    </div>
  );
};
