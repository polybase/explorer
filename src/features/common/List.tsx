import React from 'react'
import { Stack, Box, Divider, StackProps } from '@chakra-ui/react'

export interface ListProps extends StackProps {
  topDivider?: boolean
  children: React.ReactElement<any, string>[]|React.ReactElement<any, string>
}

export function List ({ children, topDivider, spacing, ...props }: ListProps) {
  return (
    <Stack spacing={spacing}>
      {topDivider && <Divider borderColor='bw.100' />}
      <Stack divider={<Divider borderColor='bw.100' />} {...props} spacing={spacing}>
        {Array.isArray(children) ? children.map((el, i) => {
          return (
            <Box key={i}>
              {el}
            </Box>
          )
        }): children}
      </Stack>
    </Stack>
  )
}