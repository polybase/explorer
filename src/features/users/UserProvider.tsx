import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import Cookies from 'js-cookie'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'
import { useNavigate } from 'react-router-dom'
import { usePolybase, useAuth } from '@polybase/react'
import { ethPersonalSignRecoverPublicKey } from '@polybase/eth'
import { User } from 'features/types'

export interface UserContextValue {
  publicKey: string | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const UserContext = createContext<UserContextValue>({
  publicKey: null,
  loading: true,
  signIn: async () => { throw new Error('Missing UserContext') },
  signOut: async () => { throw new Error('Missing UserContext') },
})

export interface UserProviderProps {
  children: React.ReactNode
  storagePrefix?: string
  domain?: string
}

export function UserProvider({ children, storagePrefix = 'polybase.', domain }: UserProviderProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const userPkPath = `${storagePrefix}publicKey`
  const db = usePolybase()
  const { auth, loading } = useAuth()
  const navigate = useNavigate()

  const getPublicKey = useCallback(async () => {
    const msg = 'Login to Polybase Explorer'
    const sig = await auth.ethPersonalSign(msg)
    const publicKey = await ethPersonalSignRecoverPublicKey(sig, msg)
    return '0x' + publicKey.slice(4)
  }, [auth])

  const signIn = useCallback(async () => {
    const authState = await auth.signIn()
    if (!authState) return

    const publicKey = authState.publicKey ?? Cookies.get(userPkPath) ?? await getPublicKey()
    if (!publicKey) return

    const col = db.collection<User>('polybase/apps/explorer/users')
    const user = await col
      .record(publicKey)
      .get()
      .catch(() => null)

    // Create if new user
    if (!user) {
      await col.create([]).catch((e) => {
        console.error(e)
        throw e
      })
    }

    Cookies.set(userPkPath, publicKey, { domain })

    if (publicKey) posthog.identify(publicKey)
    if (publicKey) Sentry.setUser({ id: publicKey })

    setPublicKey(publicKey)

    // Check if this is a new user
    navigate(user ? '/studio' : '/email')
  }, [auth, db, domain, getPublicKey, navigate, userPkPath])

  useEffect(() => {
    if (auth && !publicKey) {
      const pk = Cookies.get(userPkPath)
      if (pk) {
        setPublicKey(pk)
        posthog.identify(pk)
        Sentry.setUser({ id: pk })
      }
    }
  }, [auth, publicKey, userPkPath])

  const signOut = useCallback(async () => {
    setPublicKey(null)
    Cookies.remove(userPkPath, { domain })
    posthog.reset()
    Sentry.setUser(null)
    auth.signOut()
  }, [auth, domain, userPkPath])

  const value = useMemo(() => ({
    publicKey,
    loading,
    signIn,
    signOut,
  }), [publicKey, loading, signIn, signOut])

  return (
    <UserContext.Provider value={value}
    >
      {children}
    </UserContext.Provider>
  )
}