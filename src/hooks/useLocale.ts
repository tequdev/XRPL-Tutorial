import { useRouter } from "next/router"
import { useCallback } from "react"

type Key = string
type DefaultLocale = 'en'
type Locale = DefaultLocale | 'ja' | 'es-ES'
type Text = string
type Props = Record<Key, { [key in Locale]?: Text } & { [key in DefaultLocale]: Text }>

export const useLocale = <T extends Props>(t: T) => {
  const { locale, defaultLocale } = useRouter()

  const currentLocale = (locale || defaultLocale) as Locale

  const translate = useCallback((key: keyof T) => {
    return t[key][currentLocale] || t[key][defaultLocale as DefaultLocale]
  }, [currentLocale, defaultLocale, t])

  return translate
}
