import {
  HStack,
  Heading,
  Box,
  Stack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { Nav } from './Nav'
import { NavLogin } from './NavLogin'
import { NavIcons } from './NavIcons'

export interface SidebarProps {
  onClose: () => void
  onOpen: () => void
  isOpen: boolean
}

export function Sidebar ({ isOpen, onOpen, onClose }: SidebarProps) {

  return (
    <Drawer
      isOpen={isOpen}
      placement='left'
      onClose={onClose}
      // finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Link to='/'>
            <HStack>
              <Logo to='/' />
              <Heading as='h1' size='lg'>Explorer</Heading>
            </HStack>
          </Link>
        </DrawerHeader>

        <DrawerBody>
          <Stack>
            <Nav />
            <Box width='100%'>
              <NavLogin />
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter>
          <NavIcons />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}