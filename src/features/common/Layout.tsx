import React from 'react'
import { Loading } from 'modules/loading/Loading'
import {
  Box, Flex, Spacer, HStack, Heading, IconButton,
  useDisclosure, useBreakpointValue,
} from '@chakra-ui/react'
import { FaBars } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { NavIcons } from './NavIcons'
import { Nav } from './Nav'
import { Sidebar } from './Sidebar'
import { NavLogin } from './NavLogin'

export interface LayoutProps {
  children?: React.ReactNode|React.ReactNode[]
  logoLink?: string
  logoLinkExternal?: boolean
  isLoading?: boolean
  hideAuthBtns?: boolean
}

export function Layout ({ children, isLoading, logoLink, logoLinkExternal, hideAuthBtns }: LayoutProps) {

  const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
  })

  return (
    <Flex height='100%' flexDirection='column'>
      <HStack p={4}>
        <Link to='/'>
          <HStack>
            <Box borderRadius='md' overflow='hidden'>
              <Logo to={logoLink} external={logoLinkExternal} />
            </Box>
            <Heading as='h1' size='lg'>Explorer</Heading>
          </HStack>
        </Link>
        <Spacer />
        {!isMobile ? (
          <HStack spacing={3}>
            <Box fontWeight='600'>
              <HStack spacing={3}>
                <Nav />
              </HStack>
            </Box>
            <HStack spacing={1}>
              <NavIcons />
            </HStack>
            <NavLogin />
          </HStack>
        ) : (
          <IconButton
            variant='ghost'
            color='current'
            onClick={onToggle}
            size='lg'
            borderRadius='full'
            // _hover={{ color: 'brand.500' }}
            icon={<FaBars fontSize={24} />}
            aria-label={'Open menu'}
          />
        )}

      </HStack>
      <Box flex='1 1 auto'>
        {isLoading
          ? (
            <Box mt={10} >
              <Loading loading center data-test='layout-loading' />
            </Box>
          )
          : children}
      </Box>
      <Sidebar onClose={onClose} onOpen={onOpen} isOpen={!!(isOpen && isMobile)} />
    </Flex>
  )
}
