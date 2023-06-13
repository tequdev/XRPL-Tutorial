import { BaseRequest } from 'xrpl/dist/npm/models/methods/baseMethod'

import { useXrplClient } from './useXrplClient'

export const useCommandSender = () => {
  const client = useXrplClient()
  const sendCommand = async (command: BaseRequest) => {
    await client.connect()
    const response = await client.request({
      ...command,
    })
    return response.result
  }
  return sendCommand
}
