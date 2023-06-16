import { useEffect, useState } from 'react'

import { OnSubmitProps, OnSubmitReturnType, TransactionCodeEditor } from '@/components/TransactionEditor'
import { useAccountBalances } from '@/hooks/useAccountBalances'
import { useWallet } from '@/hooks/useWallet'

const issuer = 'rg2MAgwqwmV9TgMexVBpRDK89vMyJkpbC'
/**
 * SetupTestToken
 */
export const SetupTestToken = () => {
  const { account } = useWallet()
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
        message: 'トランザクションが失敗しました。',
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
        message: 'トークンの付与に失敗しました。再試行してください。',
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
        <div className='text-lg font-semibold'>USD残高 : {balance?.value}</div>
      )}
    </div>
  )
}
