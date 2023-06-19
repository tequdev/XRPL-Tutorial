import { useRouter } from "next/router"
import { useCallback } from "react"

type Key = string
type Locale = 'en' | 'ja'
type Text = string
type Props = Record<Key, Record<Partial<Locale> | 'en', Text>>

export const useLocale = <T extends Props>(t: T) => {
  const { locale, defaultLocale } = useRouter()

  const currentLocale = (locale || defaultLocale) as Locale

  const translate = useCallback((key: keyof T) => {
    return t[key][currentLocale]
  }, [currentLocale, t])

  return translate
}
