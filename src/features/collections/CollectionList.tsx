import { Box, Heading, Stack } from '@chakra-ui/react'
import { map } from 'lodash'
import { Link } from 'react-router-dom'
import { CollectionMeta } from '@polybase/client'
import { usePolybase, useCollection } from '@polybase/react'
import { Loading } from 'modules/loading/Loading'

export interface CollectionListProps {
  pk?: string|null
}

export function CollectionList ({ pk }: CollectionListProps) {
  const polybase = usePolybase()

  const query = polybase
    .collection('Collection')
    .limit(100)


  const { data, loading, error } = useCollection<CollectionMeta>(
    pk
      ? query.where('publicKey', '==', pk)
      : query.sort('lastRecordUpdated', 'desc'),
  )

  const items = map(data?.data, (item) => {
    return (
      <Link to={`/collections/${encodeURIComponent(item.data.id)}`} key={item.data.id}>
        <Box bg='bw.50' borderRadius='md' p={4}>
          <Heading size='md'>{item.data.id}</Heading>
        </Box>
      </Link>
    )
  })

  return (
    <Loading loading={loading}>
      {error && <Box color='error'>{error.message}</Box>}
      <Stack spacing={4}>
        {items}
      </Stack>
    </Loading>
  )
}