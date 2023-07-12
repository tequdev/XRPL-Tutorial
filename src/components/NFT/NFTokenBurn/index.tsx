import { useCallback } from 'react'
import { NFTokenBurn } from 'xrpl'

import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useLocale } from '@/hooks/useLocale'
import { useWallet } from '@/hooks/useWallet'

const translations = {
  TransactionFailed: {
    ja: 'トランザクションが失敗しました。',
    en: 'Transaction failed.',
    'es-ES': 'Transacción fallida.',
  },
} as const

/**
 * Burn NFT
 */
export const NFTBurn = () => {
  const { account } = useWallet()
  const translate = useLocale(translations)

  const checkCode = useCallback(
    async (tx: OnSubmitProps<NFTokenBurn>): Promise<OnSubmitReturnType> => {
      if (tx.meta?.TransactionResult === 'tesSUCCESS') {
        // OK
        return {
          success: true,
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
      <TransactionCodeEditor<NFTokenBurn>
        validTransactionType='NFTokenBurn'
        json={{
          TransactionType: 'NFTokenBurn',
          Account: account?.address || '',
          NFTokenID: '',
        }}
        onSubmit={(tx) => checkCode(tx)}
      />
    </div>
  )
}
