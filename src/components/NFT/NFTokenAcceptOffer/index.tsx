import { useCallback } from 'react'
import { NFTokenAcceptOffer } from 'xrpl'

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
 * Accept NFT Offer
 */
export const NFTOfferAccept = () => {
  const { account } = useWallet()
  const translate = useLocale(translations)

  const checkCode = useCallback(
    async (tx: OnSubmitProps<NFTokenAcceptOffer>): Promise<OnSubmitReturnType> => {
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
      <TransactionCodeEditor<NFTokenAcceptOffer>
        validTransactionType='NFTokenAcceptOffer'
        json={{
          TransactionType: 'NFTokenAcceptOffer',
          Account: account?.address || '',
          NFTokenSellOffer: '',
        }}
        onSubmit={(tx) => checkCode(tx)}
      />
    </div>
  )
}
