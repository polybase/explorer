import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import Cookies from 'js-cookie'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'
import createKeccakHash from 'keccak'
import { usePolybase } from '@polybase/react'
import { sign } from '@polybase/eth'
import { decodeFromString, encodeToString } from '@polybase/util'

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
  const db = usePolybase()

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
    if (pk) {
      setAuth({ publicKey: pk })
      const account = getAddressFromPublicKey(pk)
      db.signer(async (data: string) => {
        return {  h: 'eth-personal-sign', sig: await sign(data, account) }
      })
    }
  }, [db, userPkPath])

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

export function getAddressFromPublicKey (publicKey: string) {
  const pkb = decodeFromString(publicKey, 'hex')
  const hash = createKeccakHash('keccak256').update(Buffer.from(pkb)).digest()
  return encodeToString(hash.slice(-20), 'hex')
}