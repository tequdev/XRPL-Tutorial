
import { useWallet } from './useWallet'
import { useXrplClient } from './useXrplClient'

export const useAccountBalances = () => {
  const client = useXrplClient()
  const { account } = useWallet()
  const getBalances = async () => {
    await client.connect()
    const response = await client.getBalances(account?.address!)
    return response
  }
  return getBalances
}
