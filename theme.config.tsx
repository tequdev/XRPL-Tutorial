import { useRouter } from 'next/router'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'

import { Logo } from '@/components/Header/Logo'
import { Wallet } from '@/components/Header/Wallet'

const config: DocsThemeConfig = {
  useNextSeoProps() {
    return {
      titleTemplate: '%s – XRPL Tutorial',
    }
  },
  head: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { asPath, defaultLocale, locale } = useRouter()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { frontMatter } = useConfig()
    const url = 'https://xrpl-tutorial.vercel.app' + (defaultLocale === locale ? asPath : `/${locale}${asPath}`)

    return (
      <>
        <meta property='og:url' content={url} />
        <meta property='og:title' content={frontMatter.title || 'XRPL Tutorial'} />
        <meta
          property='og:description'
          content={frontMatter.description || 'XRPレジャーをWebサイト上で学びましょう！'}
        />
        <meta property='og:image' content='https://xrpl-tutorial.vercel.app/ogp.png' />
      </>
    )
  },
  logo: <Logo />,
  project: {
    link: 'https://github.com/develoQ/XRPL-Tutorial',
  },
  chat: {
    link: 'https://xrpldevs.org/',
  },
  docsRepositoryBase: 'https://github.com/develoQ/xrpl-tutorial/blob/main/',
  navbar: {
    extraContent: <Wallet />,
  },
  footer: {
    text: 'Made with ❤️ by XRP Ledger community',
  },
  i18n: [
    { locale: 'en', text: 'English' },
    { locale: 'ja', text: '日本語' },
    { locale: 'es-ES', text: 'Español (España)' },
  ],
}

export default config
