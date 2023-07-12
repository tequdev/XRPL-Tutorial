import { Transaction } from 'xrpl'

import { useXrplClient } from './useXrplClient'

export const useTransactionAutofill = () => {
  const client = useXrplClient()
  const autofill = async (txjson: Record<string, unknown>) => {
    await client.connect()
    delete txjson.LastLedgerSequence
    delete txjson.Fee
    delete txjson.Sequence
    const tx = await client.autofill(txjson as unknown as Transaction)
    // default: LastLedgerSequence = current_ledger_index + 20
    tx.LastLedgerSequence = tx.LastLedgerSequence! - 20 + 5 // about 20 sec
    return tx
  }
  return autofill
}
