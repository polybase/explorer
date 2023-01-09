import React from 'react'
import {
  Box,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useIsLoggedIn } from 'features/users/useIsLoggedIn'

const NAV_LINKS = [{
  title: 'Dashboard',
  to: '/d',
  requireAuth: true,
}, {
  title: 'Collections',
  to: '/collections',
}, {
  title: 'Docs',
  to: 'https://docs.polybase.xyz',
  external: true,
}]

export function Nav () {
  const [isLoggedIn] = useIsLoggedIn()
  const el = NAV_LINKS.filter(({ requireAuth  }) => isLoggedIn || !requireAuth).map(({ title, to, external }) => {
    const el = (
      <Box
        color='bw.800'
        textTransform='uppercase'
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
  return <>{el}</>
}