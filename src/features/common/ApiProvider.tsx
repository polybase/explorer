import React, { useState, useEffect, createContext, ReactNode } from 'react'
import axios, { AxiosInstance } from 'axios'
import { useUser } from 'features/users/useUser'

export const ApiContext = createContext<AxiosInstance>(axios.create())

export interface ApiProviderProps {
  baseURL?: string
  children: ReactNode | ReactNode[]
}

export function ApiProvider({ children, baseURL }: ApiProviderProps) {
  const { publicKey } = useUser()
  const [client, setClient] = useState<AxiosInstance>(() => axios.create({ baseURL }))

  useEffect(() => {
    if (!publicKey) return setClient(() => axios.create({ baseURL }))
    setClient(() => axios.create({
      baseURL,
      headers: {
        authorization: `Bearer ${publicKey}`,
      },
    }))
  }, [publicKey, baseURL])

  return (
    <ApiContext.Provider value={client}>
      {children}
    </ApiContext.Provider>
  )
}
