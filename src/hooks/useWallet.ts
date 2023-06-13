import { useContext } from 'react'

import { WalletContext } from '@/context/WalletContext'

export const useWallet = () => {
  const { account, createWallet, loading } = useContext(WalletContext)

  return { account, createWallet, loading }
}
