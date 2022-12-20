import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/react'
import posthog from 'posthog-js'

export interface AuthContextValue {
  auth: { publicKey: string } | null
  loading: boolean
  login: (publicKey: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
  auth: null,
  login: async (publicKey: string) => {},
  logout: async () => { console.log('demo logout') },
})

export interface AuthProviderProps {
  children: React.ReactNode
  storagePrefix?: string
  domain?: string
}

export function AuthProvider ({ children, storagePrefix = 'polybase.', domain }: AuthProviderProps) {
  const userPkPath = `${storagePrefix}publicKey`
  const [auth, setAuth] = useState<AuthContextValue['auth']>(null)
  const [loading, setLoading] = useState(true)

  const login = useCallback(async (publicKey: string) => {
    Cookies.set(userPkPath, publicKey, { domain })
    if (publicKey) posthog.identify(publicKey)
    if (publicKey) Sentry.setUser({ id: publicKey })
    setAuth({ publicKey })
  }, [domain, userPkPath])

  const logout = useCallback(async () => {
    posthog.reset()
    Sentry.setUser(null)
    setAuth(null)
  }, [])

  useEffect(() => {
    const pk = Cookies.get(userPkPath)
    setLoading(false)
    if (pk) setAuth({ publicKey: pk })
  }, [userPkPath])

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
