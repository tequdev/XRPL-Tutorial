import { NextUIProvider } from '@nextui-org/react'
import { AppProps } from 'next/app'

import { WalletContextProider } from '@/context/WalletContext'

import 'nextra-theme-docs/style.css'
import '../../styles/global.css'

export default function Nextra({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <WalletContextProider>
        <Component {...pageProps} />
      </WalletContextProider>
    </NextUIProvider>
  )
}
