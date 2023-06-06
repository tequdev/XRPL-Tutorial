import { useCallback } from 'react'

import { OnSubmitProps, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useWallet } from '@/hooks/useWallet'

/**
 * Pay XRP to account
 */
export const Payment = () => {
  const { account } = useWallet()

  const checkCode = useCallback((tx: OnSubmitProps) => {
    if (tx.meta?.TransactionResult === 'tesSUCCESS') {
      // OK
      // TODO: check if DeliveredAmount is 1 XRP
    } else {
      // NG
      console.error(tx)
    }
  }, [])

  return (
    <div>
      <TransactionCodeEditor
        validTransactionType='Payment'
        json={{
          TransactionType: 'Payment',
          Account: account?.address || '',
          Destination: '',
          Amount: '',
        }}
        onSubmit={(tx) => checkCode(tx)}
      />
    </div>
  )
}
