import { Transaction, Wallet } from 'xrpl'

import { useWallet } from './useWallet'

export const useTransactionSign = () => {
  const { account } = useWallet()
  const sign = (txjson: Record<string, unknown>) => {
    if (!account) {
      throw new Error('Wallet not created')
    }
    const { tx_blob } = Wallet.fromSeed(account.seed).sign(txjson as unknown as Transaction)
    return tx_blob
  }
  return sign
}
