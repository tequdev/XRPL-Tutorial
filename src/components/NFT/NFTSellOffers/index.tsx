import { CommandCodeEditor } from '../../CommandEditor'

/**
 * nft_sell_offers
 */
export const NFTSellOffers = () => {
  const checkCode = (tx: Record<string, unknown>) => {}

  return (
    <div>
      <CommandCodeEditor
        validCommandType='nft_sell_offers'
        json={{
          command: 'nft_sell_offers',
          nft_id: '',
          validated: true,
        }}
        onSuccess={() => {}}
      />
    </div>
  )
}
