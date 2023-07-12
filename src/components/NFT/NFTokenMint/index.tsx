import { useCallback } from 'react'
import { NFTokenMint, NFTokenMintFlags, TxResponse } from 'xrpl'

import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useLocale } from '@/hooks/useLocale'
import { useWallet } from '@/hooks/useWallet'

const translations = {
  Invalid_Flags: {
    ja: 'フラグが間違っています。',
    en: 'Invalid flags.',
    'es-ES': 'Bandeira incorrecta.',
  },
  TransactionFailed: {
    ja: 'トランザクションが失敗しました。',
    en: 'Transaction failed.',
    'es-ES': 'Transacción fallida.',
  },
} as const

const isFlagTransferable = (tx: TxResponse<NFTokenMint>['result']) => {
  const flag = tx.Flags
  if (flag === undefined) return false
  if (typeof flag === 'number') return Boolean(flag & NFTokenMintFlags.tfTransferable)
  else return flag.tfTransferable === true
}

/**
 * Mint NFT
 */
export const NFTMint = () => {
  const { account } = useWallet()
  const translate = useLocale(translations)

  const checkCode = useCallback(
    async (tx: OnSubmitProps<NFTokenMint>): Promise<OnSubmitReturnType> => {
      if (tx.meta?.TransactionResult === 'tesSUCCESS') {
        // OK
        if (isFlagTransferable(tx)) {
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
      <TransactionCodeEditor<NFTokenMint>
        validTransactionType='NFTokenMint'
        json={{
          TransactionType: 'NFTokenMint',
          Account: account?.address || '',
          NFTokenTaxon: 0,
        }}
        onSubmit={(tx) => checkCode(tx)}
      />
    </div>
  )
}
