import { Box, HStack, Link } from '@chakra-ui/react'
import { FaExternalLinkAlt } from 'react-icons/fa'

export interface ListLinkProps {
  href: string
  isExternal?: boolean
  children: React.ReactElement|string
}

export function ListLink ({ href, isExternal, children }: ListLinkProps) {
  return (
    <Box p={2}>
      <Link href={href} isExternal={isExternal}>
        <HStack>
          <Box>
            {children}
          </Box>
          {isExternal && (
            <Box fontSize='sm' opacity='0.6'>
              <FaExternalLinkAlt  />
            </Box>
          )}
        </HStack>
      </Link>
    </Box>
  )
}