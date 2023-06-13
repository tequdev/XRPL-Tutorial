import { createContext, useState } from 'react'
import { Wallet } from 'xrpl'

import { useXrplClient } from '@/hooks/useXrplClient'
import { useLocalStorage } from '@/hooks/utils'

type Context = {
  loading: boolean
  account:
    | {
        seed: string
        address: string
      }
    | undefined
  createWallet: () => Promise<void>
}

export const WalletContext = createContext<Context>({} as any)

type Props = {
  children: React.ReactNode
}

export const WalletContextProider = ({ children }: Props) => {
  const client = useXrplClient()
  const [loading, setLoading] = useState(false)
  const [seed, setSeed] = useLocalStorage<string | undefined>('testnet-seed', undefined)
  const wallet = seed ? Wallet.fromSeed(seed) : undefined

  const createWallet = async () => {
    setLoading(true)
    const wallet = Wallet.generate()
    await client.connect()
    await client.fundWallet(wallet)
    setSeed(wallet.seed!)
    setLoading(false)
  }

  const account = wallet
    ? {
        seed: wallet.seed!,
        address: wallet.address,
      }
    : undefined

  return (
    <WalletContext.Provider
      value={{
        loading,
        account,
        createWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
