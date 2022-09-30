import React from 'react'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { FaGithub } from 'react-icons/fa'
import {
  IconButton,
} from '@chakra-ui/react'

export function NavIcons () {
  return (
    <>
      <ColorModeSwitcher />
      <a href='https://github.com/spacetimehq/explorer' target='_blank' rel='noreferrer'>
        <IconButton
          fontSize='lg'
          variant='ghost'
          color='current'
          _hover={{ color: 'brand.500' }}
          icon={<FaGithub size='22px' fontSize='sm' />}
          aria-label={'View source on Github'}
        />
      </a>
    </>
  )
}