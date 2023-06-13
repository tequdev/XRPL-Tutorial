import { useContext } from 'react'

import { XrplClientContext } from '@/context/XrplClientContext'

export const useXrplClient = () => {
  const { client } = useContext(XrplClientContext)

  return client
}
