import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useWallet } from '@/hooks/useWallet'

/**
 * Send Transaction
 */
export const SendTransaction = () => {
  const { account } = useWallet()

  const checkCode = async (tx: OnSubmitProps): Promise<OnSubmitReturnType> => {
    if (tx.meta?.TransactionResult !== 'tesSUCCESS') {
      // NG
      return {
        success: false,
        message: 'トランザクションが失敗しました。',
      }
    } else {
      // OK
      return {
        success: true,
      }
    }
  }

  return (
    <div>
      <TransactionCodeEditor
        validTransactionType='AccountSet'
        json={{
          TransactionType: 'AccountSet',
          Account: account?.address || '',
        }}
        onSubmit={(tx) => checkCode(tx)}
      />
    </div>
  )
}
