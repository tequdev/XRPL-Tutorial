import { useCallback } from 'react'
import { Payment, xrpToDrops } from 'xrpl'

import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useLocale } from '@/hooks/useLocale'
import { useWallet } from '@/hooks/useWallet'

const translations = {
  Invalid_DeliveredAmount: {
    ja: '送金額が一致しません。',
    en: 'The amount of USD sent does not match.',
    'es-ES': 'La cantidad de USD enviado no coincide.',
  },
  TransactionFailed: {
    ja: 'トランザクションが失敗しました。',
    en: 'Transaction failed.',
    'es-ES': 'Transacción fallida.',
  },
} as const

/**
 * Pay XRP to account
 */
export const XRPPayment = () => {
  const { account } = useWallet()
  const translate = useLocale(translations)

  const checkCode = useCallback(
    async (tx: OnSubmitProps<Payment>): Promise<OnSubmitReturnType> => {
      if (tx.meta?.TransactionResult === 'tesSUCCESS') {
        // OK
        if (tx.meta?.delivered_amount === xrpToDrops(1)) {
          return {
            success: true,
          }
        } else {
          return {
            success: false,
            message: translate('Invalid_DeliveredAmount'),
          }
        }
      } else {
        // NG
        return {
          success: false,
          message: translate('TransactionFailed'),
        }
      }
    },
    [translate]
  )

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
