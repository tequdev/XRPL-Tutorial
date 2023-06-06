import { OnSubmitProps, TransactionCodeEditor } from "@/components/TransactionEditor";
import { useWallet } from "@/hooks/useWallet";

/**
 * Send Transaction
 */
export const SendTransaction = () => {
  const { account } = useWallet()
  
  const checkCode = (tx: OnSubmitProps) => {
    if (tx.meta?.TransactionResult !== 'tesSUCCESS') {
      // NG
      alert('error')
    } else {
      // OK
      alert('success')
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
        onSubmit={(tx) => checkCode(tx)}
      />
    </div>
  );
};
