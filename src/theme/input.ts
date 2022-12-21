import { inputAnatomy as part } from '@chakra-ui/anatomy'
import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system'
import {  mode } from '@chakra-ui/theme-tools'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(part.keys)

const variantFilled = definePartsStyle((props) => {
  return {
    field: {
      border: '2px solid',
      borderColor: 'transparent',
      bg: mode('bw.10', 'bw.50')(props),
      _hover: {
        bg: mode('bw.50', 'bw.100')(props),
      },
    },
    addon: {
      border: '2px solid',
      borderColor: 'transparent',
      bg: mode('bw.50', 'bw.50')(props),
    },
  }
})

export const Input = defineMultiStyleConfig({
  baseStyle: {
    // define the part you're going to style
    field: {
      bg: 'bw.10',
      // borderColor: 'transparent',
      _dark: {
        bg: 'bw.50',
      },
      textTransform: 'uppercase',
      ':focus-visible': {
        borderColor: 'brand.400 !important',
      },
    },
  },
  variants: {
    filled: variantFilled,
  },
})