import { Transaction } from 'xrpl'

import { useXrplClient } from './useXrplClient'

export const useTransactionAutofill = () => {
  const client = useXrplClient()
  const autofill = async (txjson: Record<string, unknown>) => {
    await client.connect()
    const tx = await client.autofill(txjson as unknown as Transaction)
    return tx
  }
  return autofill
}
