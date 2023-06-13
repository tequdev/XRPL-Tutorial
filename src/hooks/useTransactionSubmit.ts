import { useXrplClient } from './useXrplClient'

export const useTransactionSubmit = () => {
  const client = useXrplClient()
  const submit = async (txblob: string) => {
    await client.connect()
    const response = await client.submitAndWait(txblob)
    return response.result
  }
  return submit
}
