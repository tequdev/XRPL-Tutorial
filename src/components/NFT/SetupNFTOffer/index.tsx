import { Button, Loading } from '@nextui-org/react'
import { useState } from 'react'
import { NFTokenCreateOfferFlags, NFTokenMintFlags, Wallet } from 'xrpl'

import { useLocale } from '@/hooks/useLocale'
import { useWallet } from '@/hooks/useWallet'
import { useXrplClient } from '@/hooks/useXrplClient'

const translations = {
  CreateAccount: {
    ja: 'アカウントの作成',
    en: 'Transaction failed.',
  },
  CreateNFTOffer: {
    ja: 'NFT・オファーの作成',
    en: 'Create NFT Offer',
  },
} as const

/**
 * Setup for NFT Accept
 */
export const SetupNFTOffer = () => {
  const translate = useLocale(translations)
  const { account2, createWallet } = useWallet()
  const client = useXrplClient()

  const [loading, setLoading] = useState(false)
  const [nftId, setNftId] = useState<string>()

  const createAccount = async () => {
    setLoading(true)
    await createWallet(2)
    setLoading(false)
  }

  const createOffer = async () => {
    if (!account2) return
    setLoading(true)
    const wallet = Wallet.fromSeed(account2!.seed)
    await client.connect()
    const response = await client.submitAndWait(
      {
        TransactionType: 'NFTokenMint',
        Account: account2.address,
        NFTokenTaxon: 0,
        Flags: NFTokenMintFlags.tfTransferable,
      },
      { wallet }
    )
    // https://github.com/XRPLF/xrpl.js/issues/2316
    const nftId = (response.result.meta as any).nftoken_id
    await client.submitAndWait(
      {
        TransactionType: 'NFTokenCreateOffer',
        Account: account2.address,
        Amount: '0',
        NFTokenID: nftId,
        Flags: NFTokenCreateOfferFlags.tfSellNFToken,
      },
      { wallet }
    )
    setNftId(nftId)
    setLoading(false)
  }

  return (
    <div className='m-4 max-w-md'>
      {!account2 ? (
        <Button onPress={createAccount} disabled={loading}>
          {!loading ? (
            translate('CreateAccount')
          ) : (
            <Loading className='absolute bottom-0 left-0' type='points-opacity' color='white' />
          )}
        </Button>
      ) : (
        <Button onPress={createOffer} disabled={loading || !!nftId}>
          {!loading ? (
            translate('CreateNFTOffer')
          ) : (
            <Loading className='absolute bottom-0 left-0' type='points-opacity' color='white' />
          )}
        </Button>
      )}
      NFT ID: {nftId || 'none'}
    </div>
  )
}
