import { useEffect, useState } from 'react'

import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useAccountBalances } from '@/hooks/useAccountBalances'
import { useLocale } from '@/hooks/useLocale'
import { useWallet } from '@/hooks/useWallet'

const issuer = 'rg2MAgwqwmV9TgMexVBpRDK89vMyJkpbC'

const translations = {
  TransactionFailed: {
    ja: 'トランザクションが失敗しました。',
    en: 'Transaction failed.',
    'es-ES': 'Transacción fallida.',
  },
  FaucetFailed: {
    ja: 'トークンの付与に失敗しました。再試行してください。',
    en: 'Failed to faucet token. Please try again.',
    'es-ES': 'Fallo a la hora de generar el faucet del token. Por favor, inténtalo de nuevo.'
  },
  USD_Balance: {
    ja: 'USD残高',
    en: 'USD Balance',
    'es-ES': 'Balance USD',
  },
} as const

/**
 * SetupTestToken
 */
export const SetupTestToken = () => {
  const { account } = useWallet()
  const translate = useLocale(translations)
  const getBalances = useAccountBalances()
  const [balance, setBalance] =
    useState<(ReturnType<typeof getBalances> extends Promise<infer T> ? T : ReturnType<typeof getBalances>)[number]>()

  useEffect(() => {
    const f = async () => {
      if (!account) return
      const balances = await getBalances()
      const balance = balances.find((b) => b.issuer === issuer && b.currency === 'USD')
      setBalance(balance)
    }
    f()
  })

  const checkCode = async (tx: OnSubmitProps): Promise<OnSubmitReturnType> => {
    if (tx.meta?.TransactionResult !== 'tesSUCCESS') {
      // NG
      alert('error')
      return {
        success: false,
        message: translate('TransactionFailed'),
      }
    } else {
      // OK
      let count = 0
      while (count < 4) {
        count++
        const balances = await getBalances()
        const balance = balances.find((b) => b.issuer === issuer && b.currency === 'USD')

        if (parseFloat(balance?.value || '0') > 200) {
          setBalance(balance)
          alert('success')
          return {
            success: true,
          }
        } else {
          await new Promise((r) => setTimeout(r, 2000))
        }
      }
      return {
        success: false,
        message: translate('FaucetFailed'),
      }
    }
  }

  const needFaucet = !balance || parseFloat(balance.value) <= 200

  return (
    <div>
      {needFaucet ? (
        <TransactionCodeEditor
          validTransactionType='TrustSet'
          json={{
            TransactionType: 'TrustSet',
            Account: account?.address || '',
            LimitAmount: {
              currency: 'USD',
              issuer,
              value: '100000000',
            },
          }}
          onSubmit={(tx) => checkCode(tx)}
          showResult={false}
        />
      ) : (
        <div className='text-lg font-semibold'>
          {translate('USD_Balance')} : {balance?.value}
        </div>
      )}
    </div>
  )
}
