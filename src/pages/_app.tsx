import { NextUIProvider } from '@nextui-org/react'
import { AppProps } from 'next/app'

import { WalletContextProider } from '@/context/WalletContext'
import { XrplClientContextProider } from '@/context/XrplClientContext'

import 'nextra-theme-docs/style.css'
import '../../styles/global.css'

export default function Nextra({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <XrplClientContextProider>
        <WalletContextProider>
          <Component {...pageProps} />
        </WalletContextProider>
      </XrplClientContextProider>
    </NextUIProvider>
  )
}
