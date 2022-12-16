import { Heading, HeadingProps } from '@chakra-ui/react'

export interface StatProps extends HeadingProps {
  stat: number|string
}

export function Stat ({ stat, ...props }: StatProps) {
  return (
    <Heading size='4xl' bgGradient='linear(to-l, #7928CA, #FF0080)' bgClip='text' float='left' {...props}>
      {stat}
    </Heading>
  )
}
