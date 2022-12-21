// import { useColorMode } from '@chakra-ui/react'
import { useEffect } from 'react'

export function DefaultDarkMode () {
  useEffect(() => {
    if (!localStorage.getItem('chakra-ui-color-mode')) {
      localStorage.setItem('chakra-ui-color-mode', 'dark')
    }
  }, [])

  return null
}
