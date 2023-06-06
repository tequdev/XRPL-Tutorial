import { TransactionCodeEditor } from "@/components/TransactionEditor";
import { useWallet } from "@/hooks/useWallet";

/**
 * Pay XRP to account
 */
export const Payment = () => {
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
        validTransactionType="Payment"
        json={{
          TransactionType: "Payment",
          Account: account?.address || "",
        }}
        onSubmit={(tx) => checkCode(tx as unknown as Record<string, unknown>)}
      />
    </div>
  );
};
