import {
  defineStyle,
  defineStyleConfig,
} from '@chakra-ui/styled-system'
import {  mode } from '@chakra-ui/theme-tools'

  type AccessibleColor = {
    bg?: string
    color?: string
    hoverBg?: string
    activeBg?: string
  }

/** Accessible color overrides for less accessible colors. */
const accessibleColorMap: { [key: string]: AccessibleColor } = {
  yellow: {
    bg: 'yellow.400',
    color: 'black',
    hoverBg: 'yellow.500',
    activeBg: 'yellow.600',
  },
  cyan: {
    bg: 'cyan.400',
    color: 'black',
    hoverBg: 'cyan.500',
    activeBg: 'cyan.600',
  },
}

const variantSolid = defineStyle((props) => {
  const { colorScheme: c } = props

  if (c === 'gray') {
    const bg = mode('gray.50', 'whiteAlpha.200')(props)

    return {
      bg,
      _hover: {
        bg: mode('gray.100', 'whiteAlpha.300')(props),
        _disabled: {
          bg,
        },
      },
      _active: { bg: mode('gray.300', 'whiteAlpha.400')(props) },
    }
  }

  const {
    bg = `${c}.500`,
    color = 'white',
    hoverBg = `${c}.600`,
    activeBg = `${c}.700`,
  } = accessibleColorMap[c] ?? {}

  const background = mode(bg, `${c}.200`)(props)

  return {
    bg: background,
    color: mode(color, 'gray.800')(props),
    _hover: {
      bg: mode(hoverBg, `${c}.300`)(props),
      _disabled: {
        bg: background,
      },
    },
    _active: { bg: mode(activeBg, `${c}.400`)(props) },
  }
})

export const Button = defineStyleConfig({
  baseStyle: {
    textTransform: 'uppercase',
  },
  variants: {
    solid: variantSolid,
    primary: defineStyle((props) => ({
      fontSize: 'md',
      background: mode('brand.500', 'brand.500')(props),
      color: mode('rgba(255, 255, 255, 0.92)', 'rgba(255, 255, 255, 0.80)')(props),
      ':hover': {
        background: mode('brand.600', 'brand.600')(props),
      },
      ':active': {
        background: 'brand.700',
      },
    })),
  },
})