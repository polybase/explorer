import { useAuth } from './useAuth'

export function useCurrentUserId (): [string|null, boolean] {
  const { auth, loading } = useAuth()
  return [auth?.publicKey ?? null, loading]
}
