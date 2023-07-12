import { useContext } from 'react'

import { WalletContext } from '@/context/WalletContext'

export const useWallet = () => {
  const { account, account2, createWallet, loading } = useContext(WalletContext)

  return { account, account2, createWallet, loading }
}
