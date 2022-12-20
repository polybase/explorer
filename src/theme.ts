import { extendTheme } from '@chakra-ui/react'

const mode = (light: any, _dark: any) => ({ default: light, _dark })

const theme = extendTheme({
  initialColorMode: 'dark',
  // useSystemColorMode: false,
  fonts: {
    heading: 'Inter, "Open Sans", "Source Sans Pro", Arial, Helvetica, sans-serif',
    body: 'Inter, "Open Sans", "Source Sans Pro", Arial, Helvetica, sans-serif',
  },
  styles: {
    global: (props: any) => ({
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      'html, body, #root': {
        height: '100%',
        fontSize: '14px',
        color: 'bw.800',
      },
      body: {
        fontFamily: 'Inter, "Open Sans", "Source Sans Pro", Arial, Helvetica, sans-serif',
        height: '100%',
        backgroundImage: props.colorMode === 'dark' ? 'linear-gradient(var(--chakra-colors-gradient), var(--chakra-colors-gray-800))' : undefined,
        backgroundRepeat: 'repeat-x,no-repeat',
      },
    }),
  },
  semanticTokens: {
    colors: {
      error: 'red.500',
      warning: mode('#ca4b03c7', '#cc630887'),
      'bw.50': mode('rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0.04)'),
      'bw.100': mode('rgba(0, 0, 0, 0.06)','rgba(255, 255, 255, 0.06)'),
      'bw.200': mode('rgba(0, 0, 0, 0.08)', 'rgba(255, 255, 255, 0.08)'),
      'bw.300': mode('rgba(0, 0, 0, 0.16)', 'rgba(255, 255, 255, 0.16)'),
      'bw.400': mode('rgba(0, 0, 0, 0.24)', 'rgba(255, 255, 255, 0.24)'),
      'bw.500': mode('rgba(0, 0, 0, 0.36)', 'rgba(255, 255, 255, 0.36)'),
      'bw.600': mode('rgba(0, 0, 0, 0.48)', 'rgba(255, 255, 255, 0.48)'),
      'bw.700': mode('rgba(0, 0, 0, 0.64)', 'rgba(255, 255, 255, 0.64)'),
      'bw.800': mode('rgba(0, 0, 0, 0.80)', 'rgba(255, 255, 255, 0.80)'),
      'bw.900': mode('rgba(0, 0, 0, 0.92)', 'rgba(255, 255, 255, 0.92)'),
    },
  },
  colors: {
    gradient: '#501044',
    brand: {
      '50': '#F6EFF6',
      '100': '#E5D2E5',
      '200': '#D4B5D4',
      '300': '#C398C3',
      '400': '#B27AB2',
      '500': '#A25DA1',
      '600': '#814B80',
      '700': '#613860',
      '800': '#412540',
      '900': '#201320',
    },
    orange:
    {
      50: '#ffeee1',
      100: '#f6d0bb',
      200: '#ecb193',
      300: '#e2936a',
      400: '#d87440',
      500: '#E2852E',
      600: '#95461d',
      700: '#6b3113',
      800: '#421d08',
      900: '#1d0700',
    },
  },
  components: {
    Input: {
      baseStyle: {
        // define the part you're going to style
        field: {
          textTransform: 'uppercase',
          ':focus-visible': {
            borderColor: 'brand.400 !important',
          },
        },
      },
      varient: {
        primary: {
          padding: '1em',
        },
      },
    },
    Button: {
      baseStyle: {
        textTransform: 'uppercase',
      },
      variants: {
        primary: {
          fontSize: 'md',
          background: 'brand.500',
          color: 'bw.800',
          ':hover': {
            background: 'brand.600',
          },
          ':active': {
            background: 'brand.700',
          },
        },
      },
    },
    Tabs: {
      baseStyle: {
        root: {
          color: 'bw.500',
        },
        tab: {
          fontWeight: 'semibold',
          mr: '2em',
          _selected: {
            color: 'brand.300',
          },
        },
      },
    },
  },
})

export default theme

