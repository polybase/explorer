import React from 'react'
import {
  Box, Img, Link,
} from '@chakra-ui/react'
import logo from 'img/logo.svg'

export interface LogoProps {
  to?: string|null
  external?: boolean
}

export function Logo ({ to, external }: LogoProps) {
  const logoEl = (
    <Box borderRadius='md' overflow='hidden'>
      <Img src={logo} height={'48px'} minWidth={35} />
    </Box>
  )
  return to ? <Link isExternal={external} href={to}>{logoEl}</Link> : logoEl
}
