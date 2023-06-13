import { createContext } from 'react'
import { Client } from 'xrpl'

type Context = {
  client: Client
}

export const XrplClientContext = createContext<Context>({} as any)

type Props = {
  children: React.ReactNode
}

export const XrplClientContextProider = ({ children }: Props) => {
  const client = new Client('wss://testnet.xrpl-labs.com')

  return (
    <XrplClientContext.Provider
      value={{
        client,
      }}
    >
      {children}
    </XrplClientContext.Provider>
  )
}
