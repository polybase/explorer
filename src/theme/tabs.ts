import { tabsAnatomy as parts } from '@chakra-ui/anatomy'
import {
  defineStyle,
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const { defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

export const Tabs = defineMultiStyleConfig({
  baseStyle: defineStyle((props) => ({
    root: {
      color: 'bw.500',
    },
    tab: {
      fontWeight: 'semibold',
      mr: '2em',
      _selected: {
        color: mode('brand.500', 'brand.300')(props),
      },
    },
  })),
})