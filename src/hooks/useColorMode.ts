import { useTheme } from 'nextra-theme-docs'

export const useDarkMode = () => {
  const { theme } = useTheme()
  return theme === 'dark'
}
