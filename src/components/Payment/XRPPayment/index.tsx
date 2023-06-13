import { useCallback } from 'react'
import { Payment, xrpToDrops } from 'xrpl'

import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useWallet } from '@/hooks/useWallet'

/**
 * Pay XRP to account
 */
export const XRPPayment = () => {
  const { account } = useWallet()

  const checkCode = useCallback(async (tx: OnSubmitProps<Payment>): Promise<OnSubmitReturnType> => {
    if (tx.meta?.TransactionResult === 'tesSUCCESS') {
      // OK
      if (tx.meta?.delivered_amount === xrpToDrops(1)) {
        return {
          success: true,
        }
      } else {
        return {
          success: false,
          message: '送金額が一致しません。',
        }
      }
    } else {
      // NG
      return {
        success: false,
        message: 'トランザクションが失敗しました。',
      }
    }
  }, [])

  return (
    <div>
      <TransactionCodeEditor<Payment>
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
