import { Box, Heading, Stack, Flex, Spacer, BoxProps } from '@chakra-ui/react'

export interface PanelProps extends BoxProps {
  title: string
  children: React.ReactElement
}

export function Panel ({ title, children, ...props }: PanelProps) {
  const el = (
    <Stack bg='bw.50' borderRadius='lg' p={4} flex='1 1 auto' spacing={3} {...props}>
      <Flex display='flex'>
        <Heading size='xs' textTransform='uppercase' color={props.color ?? 'bw.700'}>
          {title}
        </Heading>
        <Spacer />
      </Flex>
      <Box>
        {children}
      </Box>
    </Stack>
  )
  return el
}
