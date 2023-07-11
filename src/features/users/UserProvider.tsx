import React, { createContext, useCallback, useMemo } from 'react'
import Cookies from 'js-cookie'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'
import { useNavigate } from 'react-router-dom'
import { usePolybase, useAuth } from '@polybase/react'
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
  const userPkPath = `${storagePrefix}publicKey`
  const db = usePolybase()
  const { auth, state, loading } = useAuth()
  const navigate = useNavigate()

  const signIn = useCallback(async () => {
    const authState = await auth.signIn().catch((e) => {
      if (e.message.startsWith('user-cancelled-request')) {
        return null
      }
      throw e
    })
    if (!authState) return

    const publicKey = authState.publicKey
    if (!publicKey) return

    Cookies.set(userPkPath, publicKey, { domain })
    if (publicKey) posthog.identify(publicKey)
    if (publicKey) Sentry.setUser({ id: publicKey })

    const col = db.collection<User>('polybase/apps/explorer/v2/users')
    const userExists: boolean = await col
      .record(publicKey)
      .get()
      .then((user) => {
        return user.data?.v === 1
      })

    // Check if this is a new user
    navigate(userExists ? '/studio' : '/email')
  }, [auth, db, domain, navigate, userPkPath])

  const signOut = useCallback(async () => {
    posthog.reset()
    Sentry.setUser(null)
    auth.signOut()
  }, [auth])

  const value = useMemo(() => ({
    publicKey: state?.publicKey ?? null,
    loading,
    signIn,
    signOut,
  }), [state?.publicKey, loading, signIn, signOut])

  return (
    <UserContext.Provider value={value}
    >
      {children}
    </UserContext.Provider>
  )
}