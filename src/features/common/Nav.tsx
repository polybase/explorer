import React from 'react'
import {
  Box,
  Button,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useIsAuthenticated } from '@polybase/react'
import { useUser } from 'features/users/useUser'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'

const NAV_LINKS = [{
  title: 'Studio',
  to: '/studio',
  requireAuth: true,
}, {
  title: 'Collections',
  to: '/collections',
}, {
  title: 'Docs',
  to: 'https://docs.polybase.xyz',
  external: true,
}]

export function Nav() {
  const { signIn } = useUser()
  const [isLoggedIn] = useIsAuthenticated()
  // const signInAsync = useAsyncCallback(signIn)
  const navigate = useNavigate()

  const createCollection = useAsyncCallback(async () => {
    if (!isLoggedIn) {
      await signIn()
      navigate('/studio/create')
    }
    navigate('/studio/create')
  })

  const el = NAV_LINKS.filter(({ requireAuth }) => isLoggedIn || !requireAuth).map(({ title, to, external }) => {
    const el = (
      <Box
        color='bw.800'
        _hover={{ color: 'brand.500' }}
        fontWeight='600'
        p={2}
      >
        {title}
      </Box>
    )
    if (external) {
      return (
        <a
          href={to}
          target='_blank'
          rel='noreferrer'
          key={title}
        >
          {el}
        </a>
      )
    }

    return (
      <Link to={to} key={title}>
        {el}
      </Link>
    )
  })
  return (
    <>
      <Button size='sm' colorScheme='brand' onClick={createCollection.execute} isLoading={createCollection.loading}>Create Collection</Button>
      {el}
    </>
  )
}