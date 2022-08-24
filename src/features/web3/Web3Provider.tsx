import React, { createContext, ReactNode } from 'react'
import Web3 from 'web3'

export const Web3ProviderContext = createContext<Web3>(new Web3())

export interface Web3ProviderProps {
  web3: Web3
  children: ReactNode|ReactNode[]
}

export function Web3Provider ({ children, web3 }: Web3ProviderProps) {
  return (
    <Web3ProviderContext.Provider value={web3}>
      {children}
    </Web3ProviderContext.Provider>
  )
}
