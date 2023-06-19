import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useLocale } from '@/hooks/useLocale'
import { useWallet } from '@/hooks/useWallet'

const translations = {
  TransactionFailed: {
    ja: 'トランザクションが失敗しました。',
    en: 'Transaction failed.',
  },
} as const

/**
 * Send Transaction
 */
export const SendTransaction = () => {
  const { account } = useWallet()
  const translate = useLocale(translations)

  const checkCode = async (tx: OnSubmitProps): Promise<OnSubmitReturnType> => {
    if (tx.meta?.TransactionResult !== 'tesSUCCESS') {
      // NG
      return {
        success: false,
        message: translate('TransactionFailed'),
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
