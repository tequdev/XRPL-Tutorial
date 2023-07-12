import { CommandCodeEditor } from '../../CommandEditor'

import { useWallet } from '@/hooks/useWallet'

/**
 * Account NFTs
 */
export const AccountNfts = () => {
  const { account } = useWallet()

  const checkCode = (tx: Record<string, unknown>) => {}

  return (
    <div>
      <CommandCodeEditor
        validCommandType='account_nfts'
        json={{
          command: 'account_nfts',
          account: account?.address,
          validated: true,
        }}
        onSuccess={() => {}}
      />
    </div>
  )
}
