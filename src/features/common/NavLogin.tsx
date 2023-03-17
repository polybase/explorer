import React from 'react'
import {
  Button,
} from '@chakra-ui/react'
import { useIsAuthenticated } from '@polybase/react'
import { useUser } from 'features/users/useUser'

export function NavLogin() {
  const { signIn, signOut } = useUser()
  const [isLoggedIn, isLoggedInLoading] = useIsAuthenticated()

  if (isLoggedInLoading) return null

  if (!isLoggedIn) {
    return <Button width='100%' onClick={signIn}>Login</Button>
  }

  return (
    <Button width='100%' onClick={async () => {
      await signOut()
    }}>
      Logout
    </Button>
  )
}