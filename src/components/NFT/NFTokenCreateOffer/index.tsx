import { useCallback } from 'react'
import { NFTokenCreateOffer, NFTokenCreateOfferFlags, TxResponse } from 'xrpl'

import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useLocale } from '@/hooks/useLocale'
import { useWallet } from '@/hooks/useWallet'

const translations = {
  Invalid_Flags: {
    ja: 'フラグが間違っています。',
    en: 'Invalid flags.',
    'es-ES': 'Banderas incorrectas.',
  },
  TransactionFailed: {
    ja: 'トランザクションが失敗しました。',
    en: 'Transaction failed.',
    'es-ES': 'Transacción fallida.',
  },
} as const

const isFlagSell = (tx: TxResponse<NFTokenCreateOffer>['result']) => {
  const flag = tx.Flags
  if (flag === undefined) return false
  if (typeof flag === 'number') return Boolean(flag & NFTokenCreateOfferFlags.tfSellNFToken)
  else return flag.tfSellNFToken === true
}

/**
 * Create NFT Offer
 */
export const NFTOfferCreate = () => {
  const { account } = useWallet()
  const translate = useLocale(translations)

  const checkCode = useCallback(
    async (tx: OnSubmitProps<NFTokenCreateOffer>): Promise<OnSubmitReturnType> => {
      if (tx.meta?.TransactionResult === 'tesSUCCESS') {
        // OK
        if (isFlagSell(tx)) {
          return {
            success: true,
          }
        } else {
          return {
            success: false,
            message: translate('Invalid_Flags'),
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
      <TransactionCodeEditor<NFTokenCreateOffer>
        validTransactionType='NFTokenCreateOffer'
        json={{
          TransactionType: 'NFTokenCreateOffer',
          Account: account?.address || '',
          NFTokenID: '',
          Amount: '',
        }}
        onSubmit={(tx) => checkCode(tx)}
      />
    </div>
  )
}
