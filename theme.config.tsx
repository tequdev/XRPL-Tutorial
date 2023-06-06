import { DocsThemeConfig } from 'nextra-theme-docs/.'

import { Wallet } from '@/components/Header/Wallet'

const config: DocsThemeConfig = {
  logo: <span>XRPL Tutorials</span>,
  project: {
    link: 'https://github.com',
  },
  chat: {
    link: 'https://discord.gg/xrpl',
  },
  docsRepositoryBase: 'https://github.com/justmoon/dassie/tree/main/packages/app-website',
  navbar: {
    extraContent: <Wallet />,
  },
  footer: {
    text: 'Made with ❤️ by a team of dassies',
  },
}

export default config
