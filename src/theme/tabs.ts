import { tabsAnatomy as parts } from '@chakra-ui/anatomy'
import {
  defineStyle,
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys)

export const Tabs = defineMultiStyleConfig({
  baseStyle: defineStyle((props) => ({
    root: {
      // color: 'bw.500',
    },
    tab: {
      fontWeight: 'semibold',
      mr: '1em',
      opacity: 0.8,
      _selected: {
        opacity: 1,
        color: mode('brand.600', 'brand.300')(props),
      },
    },
  })),
  variants: {
    'soft-rounded': definePartsStyle((props) => {
      const { colorScheme: c, theme } = props
      return {
        tab: {
          _selected: {
            bg: mode('brand.50', 'brand.900')(props),
            color: mode('brand.600', 'brand.300')(props),
          },
        },
      }
    }),
  },
})