import { Box, Heading, Stack, Flex, Spacer, BoxProps } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export interface PanelProps extends BoxProps {
  title: string
  to?: string
  children: React.ReactElement
  footer?: React.ReactElement
}

export function Panel({ title, to, children, ...props }: PanelProps) {
  const headerEl = (
    <Heading size='sm' textTransform='uppercase' color={props.color ?? 'bw.700'}>
      {title}
    </Heading>
  )
  const el = (
    <Box bg='bw.10' _dark={{ border: 0, bg: 'bw.50' }} borderRadius='lg' border='1px solid' borderColor='bw.50' p={4} flex='1 1 auto' {...props} >
      <Stack spacing={3}>
        <Flex display='flex'>
          {to ? <Link to={to}>{headerEl}</Link> : headerEl}
          <Spacer />
        </Flex>
        <Box>
          {children}
        </Box>
      </Stack>
    </Box>
  )
  return el
}
