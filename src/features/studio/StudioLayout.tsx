import { Box, Flex, Spacer, Img, useColorMode, HStack, Heading, Link as CLink } from '@chakra-ui/react'
import logo from 'img/logo-outline.svg'
import logoInvert from 'img/logo-outline-invert.svg'
import { ColorModeSwitcher } from 'features/common/ColorModeSwitcher'
import { Link } from 'react-router-dom'
import { NavLogin } from 'features/common/NavLogin'

export interface StudioLayoutProps {
  children: React.ReactNode
  name?: string
}

export function StudioLayout({ children, name }: StudioLayoutProps) {
  const color = useColorMode()
  return (
    <Flex flexDirection='column' height='100%'>
      <Box borderBottom='1px solid' borderColor='bw.100' p={1}>
        <Flex height='42px' alignItems='center'>
          <HStack p={2}>
            <Link to='/studio'>
              <Img src={color.colorMode === 'dark' ? logoInvert : logo} height='28px' minWidth={35} />
            </Link>
            {name && (
              <Heading as='h1' size='md'>{name}</Heading>
            )}
          </HStack>
          <Spacer />
          <HStack height='100%' alignItems='center' px={2} spacing={4}>
            <ColorModeSwitcher />
            <CLink isExternal fontWeight='600' href='https://polybase.xyz/docs'>Docs</CLink>
            <NavLogin />
          </HStack>
        </Flex>
      </Box >
      <Box height='100%' minH={0} flex='1 1 auto'>
        {children}
      </Box>
    </Flex >
  )
}