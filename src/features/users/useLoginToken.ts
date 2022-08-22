import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export function useLoginToken () {
  const navigate = useNavigate()
  const { login } = useAuth()

  return useCallback(async (token: string, userId: string, email?: string, redirect = true) => {
    login(token, userId, email)
    if (redirect) navigate('/w')
    return true
  }, [navigate, login])
}
