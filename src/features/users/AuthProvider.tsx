import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import Cookies from 'js-cookie'
import ReactGA from 'react-ga'
import * as Sentry from '@sentry/react'
import posthog from 'posthog-js'
// import { useApi } from 'features/common/useApi'

export interface AuthContextValue {
  auth: { token: string, userId?: string|undefined|null, loginAsUser: boolean } | null
  loading: boolean
  login: (token: string, userId?: string, email?:string|null, loginAsUser?: boolean) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
  auth: null,
  login: async (token: string, userId?: string, email?: string|null, loginAsUser?: boolean) => {},
  logout: async () => { console.log('demo logout') },
})

export interface AuthProviderProps {
  children: React.ReactNode
  storagePrefix?: string
  domain?: string
}

export function AuthProvider ({ children, storagePrefix = 'hirestack.', domain }: AuthProviderProps) {
  const tokenPath = `${storagePrefix}token`
  const userIdPath = `${storagePrefix}userId`
  const loginAsUserPath = `${storagePrefix}loginAsUserPath`
  const [auth, setAuth] = useState<AuthContextValue['auth']>(null)
  const [loading, setLoading] = useState(true)
  // const client = useApi()

  const login = useCallback(async (token: string, userId?: string, email?: string|null, loginAsUser?: boolean) => {
    Cookies.set(tokenPath, token, { domain })
    if (loginAsUser) Cookies.set(loginAsUserPath, '1', { domain })
    if (userId) Cookies.set(userIdPath, userId, { domain })
    if (!loginAsUser) {
      if (userId) posthog.identify(userId, { email })
      if (email) Sentry.setUser({ email, id: userId })
    }
    setAuth({ token, userId, loginAsUser: !!loginAsUser })
    ReactGA.ga('event', 'login')
  }, [tokenPath, domain, loginAsUserPath, userIdPath])

  const logout = useCallback(async () => {
    Cookies.remove(tokenPath, { domain })
    Cookies.remove(userIdPath, { domain })
    Cookies.remove(loginAsUserPath, { domain })
    posthog.reset()
    // client.cache.reset()
    Sentry.setUser(null)
    setAuth(null)
  }, [tokenPath, domain, userIdPath, loginAsUserPath])

  useEffect(() => {
    const token = Cookies.get(tokenPath)
    const userId = Cookies.get(userIdPath)
    const loginAsUser = Cookies.get(loginAsUserPath) === '1'
    setLoading(false)
    if (token) setAuth({ token, userId, loginAsUser })
  }, [loginAsUserPath, tokenPath, userIdPath])

  const value = useMemo(() => ({
    auth,
    loading,
    login,
    logout,
  }), [auth, loading, login, logout])

  return (
    <AuthContext.Provider value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function decodeTokenUserId (token?: string|null) {
  if (!token) return null
  try {
    const base = token.split('.').pop()
    if (!base) return
    return JSON.parse(window.atob(base))?.id
  } catch (e) {
    return null
  }
}
