import React from 'react'
import {
  Button,
} from '@chakra-ui/react'
import { useCurrentUserId } from 'features/users/useCurrentUserId'
import { useAuth } from 'features/users/useAuth'
import { useLogin } from 'features/users/useLogin'

export function NavLogin () {
  const auth = useAuth()
  const [userId, userIdLoading] = useCurrentUserId()
  const login = useLogin()

  if (userIdLoading) return null

  if (!userId) {
    return <Button width='100%' onClick={login}>Login</Button>
  }

  return (
    <Button width='100%' onClick={async () => {
      await auth.logout()
      // navigate('/')
    }}>
      Logout
    </Button>
  )
}