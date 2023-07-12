import { track } from '@vercel/analytics/react'
import { createContext, useEffect, useState } from 'react'
import { Wallet } from 'xrpl'

import { useXrplClient } from '@/hooks/useXrplClient'
import { useLocalStorage } from '@/hooks/utils'

type Account = {
  seed: string
  address: string
}

type Context = {
  loading: boolean
  account: Account | undefined
  account2: Account | undefined
  createWallet: (index?: 1 | 2) => Promise<void>
}

export const WalletContext = createContext<Context>({} as any)

type Props = {
  children: React.ReactNode
}

export const WalletContextProider = ({ children }: Props) => {
  const client = useXrplClient()
  const [loading, setLoading] = useState(false)
  const [seed, setSeed] = useLocalStorage<string | undefined>('testnet-seed', undefined)
  const [seed2, setSeed2] = useLocalStorage<string | undefined>('testnet-seed-2', undefined)
  const wallet = seed ? Wallet.fromSeed(seed) : undefined
  const wallet2 = seed2 ? Wallet.fromSeed(seed2) : undefined

  useEffect(() => {
    if (wallet && !wallet2) {
      const w = Wallet.generate()
      client.connect().then(() => {
        client.fundWallet(w).then(() => {
          setSeed2(w.seed!)
        })
      })
    }
  }, [client, setSeed2, wallet, wallet2])

  const createWallet = async (index: 1 | 2 = 1) => {
    setLoading(true)
    const wallet = Wallet.generate()
    await client.connect()
    await client.fundWallet(wallet)
    if (index === 1) {
      setSeed(wallet.seed!)
    } else if (index === 2) {
      setSeed2(wallet.seed!)
    } else {
      throw new Error('Invalid index')
    }
    setLoading(false)
    track('create-wallet')
  }

  const account = wallet
    ? {
        seed: wallet.seed!,
        address: wallet.address,
      }
    : undefined

  const account2 = wallet2
    ? {
        seed: wallet2.seed!,
        address: wallet2.address,
      }
    : undefined

  return (
    <WalletContext.Provider
      value={{
        loading,
        account,
        account2,
        createWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
