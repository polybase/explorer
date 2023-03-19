import { useContext } from 'react'
import { UserContext } from './UserProvider'

export function useUser() {
  return useContext(UserContext)
}
