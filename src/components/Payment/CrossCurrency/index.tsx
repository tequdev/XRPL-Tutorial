import { useCallback } from 'react'
import { Payment } from 'xrpl'

import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useLocale } from '@/hooks/useLocale'
import { useWallet } from '@/hooks/useWallet'

const translations = {
  Specify_USD_Amount: {
    ja: 'AmountにはUSDの額を指定しましょう。',
    en: 'Specify the amount of USD in Amount.',
    'es-ES': 'Especifica la cantidad de USD en Amount.',
  },
  Specify_XRP_SendMax: {
    ja: 'SendMaxにはXRP(drop)の額を指定しましょう。',
    en: 'Specify the amount of XRP(drop) in SendMax.',
    'es-ES': 'Especifica la cantidad de XRP(drop) en SendMax.',
  },
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
 * Pay Token to account
 */
export const CrossCurrency = () => {
  const { account } = useWallet()
  const translate = useLocale(translations)

  const checkCode = useCallback(
    async (tx: OnSubmitProps<Payment>): Promise<OnSubmitReturnType> => {
      if (tx.meta?.TransactionResult === 'tesSUCCESS') {
        // OK
        // TODO: check if DeliveredAmount is 10 USD
        const delivered_amount = tx.meta?.delivered_amount
        if (typeof tx.Amount !== 'object') {
          return {
            success: false,
            message: translate('Specify_USD_Amount'),
          }
        }
        if (typeof tx.SendMax !== 'string') {
          return {
            success: false,
            message: translate('Specify_XRP_SendMax'),
          }
        }
        if (
          typeof delivered_amount === 'object' &&
          delivered_amount.currency === 'USD' &&
          delivered_amount.value === '10'
        ) {
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
          Amount: {
            issuer: 'rg2MAgwqwmV9TgMexVBpRDK89vMyJkpbC',
            currency: 'USD',
            value: '',
          },
          SendMax: '',
        }}
        onSubmit={(tx) => checkCode(tx)}
      />
    </div>
  )
}
