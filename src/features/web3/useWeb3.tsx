import { useContext } from 'react'
import { Web3ProviderContext } from './Web3Provider'

export function useWeb3 () {
  return useContext(Web3ProviderContext)
}