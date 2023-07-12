import { useTheme } from 'nextra-theme-docs'

export const useDarkMode = () => {
  const { theme, systemTheme } = useTheme()
  return (theme === 'system' ? systemTheme : theme) === 'dark'
}
