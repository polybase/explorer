// import { Link } from 'react-router-dom'
import { HStack, Stack, Heading } from '@chakra-ui/react'
import { CollectionMeta } from '@polybase/client'
import { usePolybase, useCollection } from '@polybase/react'
import { List } from 'features/common/List'

export interface CollectionMetaEx extends CollectionMeta {
  lastRecordUpdated: string
}

export function CollectionsShortList () {
  const polybase = usePolybase()
  const { data, loading, error } = useCollection<CollectionMeta>(
    polybase.collection('Collection').limit(5).sort('lastRecordUpdated'),
  )

  console.log(data)

  const items = data?.data ? data?.data.map((item) => {
    return (
      <HStack>
        <Stack spacing={1}>
          <Heading size='xs'>{item.data.id}</Heading>
          {/* <Text fontSize='xs'>{item.data.}</Text> */}
        </Stack>
      </HStack>
    )
  }) : []

  return (
    <List>
      {items}
    </List>
  )
}