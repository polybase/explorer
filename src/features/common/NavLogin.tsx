import {
  Button,
} from '@chakra-ui/react'
import { useIsAuthenticated } from '@polybase/react'
import { useUser } from 'features/users/useUser'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'

export function NavLogin() {
  const { signIn, signOut } = useUser()
  const [isLoggedIn, isLoggedInLoading] = useIsAuthenticated()

  const signInAsync = useAsyncCallback(signIn)
  const signOutAsync = useAsyncCallback(signOut)

  if (isLoggedInLoading) return null

  if (!isLoggedIn) {
    return <Button width='100%' onClick={signInAsync.execute} isLoading={signInAsync.loading}>Login</Button>
  }

  return (
    <Button width='100%' onClick={signOutAsync.execute} isLoading={signOutAsync.loading}>
      Logout
    </Button>
  )
}