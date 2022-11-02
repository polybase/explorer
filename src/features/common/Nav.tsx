import React from 'react'
import {
  Box,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [{
  title: 'Collections',
  to: '/collections',
}, {
  title: 'Docs',
  to: 'https://docs.polybase.xyz',
  external: true,
}]

export function Nav () {
  const el = NAV_LINKS.map(({ title, to, external }) => {
    const el = (
      <Box _hover={{ color: 'brand.500' }} fontWeight='600' key={title} p={2}>
        {title}
      </Box>
    )
    if (external) {
      return (
        <a href={to} target='_blank' rel='noreferrer'>
          {el}
        </a>
      )
    }

    return (
      <Link to={to}>
        {el}
      </Link>
    )
  })
  return <>{el}</>
}