import { Client } from 'xrpl'

const client = new Client('wss://testnet.xrpl-labs.com')
export const useTransactionSubmit = () => {
  const submit = async (txblob: string) => {
    await client.connect()
    const response = await client.submitAndWait(txblob)
    return response.result
  }
  return submit
}
