import { Box, Heading, Stack, Flex, Spacer } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export interface StatProps {
  title: string
  stat: number|string
  to?: string
}

export function Stat ({ title, stat, to }: StatProps) {
  const el = (
    <Stack bg='bw.50' borderRadius='lg' p={8} flex='1 1 auto' spacing={3} _hover={{
      bg: to ? 'bw.100' : 'bw.50',
    }}>
      <Flex display='flex'>
        <Heading size='4xl' bgGradient='linear(to-l, #7928CA, #FF0080)' bgClip='text' float='left'>
          {stat}
        </Heading>
        <Spacer />
      </Flex>
      <Box px={3}>
        <Heading size='md' color='bw.800' textTransform='uppercase' overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>
          {title}
        </Heading>
      </Box>
    </Stack>
  )

  if (to) {
    return (
      <Link to={to}>
        {el}
      </Link>
    )
  }

  return el
}
