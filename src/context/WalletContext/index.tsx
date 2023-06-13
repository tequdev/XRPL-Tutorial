import { createContext, useState } from 'react'
import { Client, Wallet } from 'xrpl'

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
  const [loading, setLoading] = useState(false)
  const [seed, setSeed] = useLocalStorage<string | undefined>('testnet-seed', undefined)
  const wallet = seed ? Wallet.fromSeed(seed) : undefined

  const createWallet = async () => {
    setLoading(true)
    const wallet = Wallet.generate()
    const client = new Client('wss://testnet.xrpl-labs.com')
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
