import { Box } from '@chakra-ui/react'
import { CollectionList } from 'features/collections/CollectionList'
import { useCurrentUserId } from 'features/users/useCurrentUserId'

export function DashboardCollections () {
  const [publicKey] = useCurrentUserId()
  return (
    <Box p={3}>
      <CollectionList pk={publicKey} />
    </Box>
  )
}