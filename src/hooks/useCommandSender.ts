import { Client } from "xrpl";
import { BaseRequest } from "xrpl/dist/npm/models/methods/baseMethod";

const client = new Client("wss://testnet.xrpl-labs.com");
export const useCommandSender = () => {
  const sendCommand = async (command: BaseRequest) => {
    await client.connect();
    const response = await client.request({
      ...command,
    });
    return response.result;
  };
  return sendCommand;
};
