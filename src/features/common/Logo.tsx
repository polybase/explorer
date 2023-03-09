import React from 'react'
import {
  Box, Img, Link,
} from '@chakra-ui/react'
import logo from 'img/logo.svg'

export interface LogoProps {
  to?: string | null
  external?: boolean
  height?: string
}

export function Logo({ to, external, height = '48px' }: LogoProps) {
  const logoEl = (
    <Box borderRadius='md' overflow='hidden'>
      <Img src={logo} height={height} minWidth={35} />
    </Box>
  )
  return to ? <Link isExternal={external} href={to}>{logoEl}</Link> : logoEl
}
