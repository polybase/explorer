import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Stack, Box, HStack, Heading } from '@chakra-ui/react'
import useInterval from 'use-interval'
import { usePolybase, useCollection } from '@polybase/react'
import { CollectionMetaEx } from '../types'
import { Stat } from 'features/common/Stat'
import { Panel } from 'features/common/Panel'
import { List } from 'features/common/List'

const LIMIT = 100

export interface CollectionPanelProps {
  pk?: string | null,
  testId: string,
}

export function CollectionPanel({ pk, testId }: CollectionPanelProps) {
  const [count, setCount] = useState('-')
  const polybase = usePolybase()
  const query = polybase
    .collection('Collection')
    .limit(LIMIT)


  const { data } = useCollection<CollectionMetaEx>(
    pk
      ? query.where('publicKey', '==', pk)
      : query.sort('lastRecordUpdated', 'desc'),
  )

  // TODO: Replace this with a better count
  useInterval(async () => {
    let query = polybase
      .collection('Collection')
      .limit(LIMIT)

    if (pk) {
      query = query.where('publicKey', '==', pk)
    }

    let res = await query.get()
    let count = res.data?.length ?? 0

    while (res?.data?.length === LIMIT) {
      res = await query.limit(LIMIT).after(res?.cursor?.after).get()
      count += res?.data?.length ?? 0
    }

    setCount(`${count}`)
  }, 10000, true)

  const items = data?.data ? data?.data
    .map((item) => {
      return (
        <HStack key={item.data.id}>
          <Stack spacing={1} width='100%'>
            <Box>
              <Link to={`/collections/${encodeURIComponent(item.data.id)}`}>
                <Box p={1}>
                  <Heading textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap' display='block' size='xs'>{item.data.id}</Heading>
                </Box>
              </Link>
            </Box>
          </Stack>
        </HStack>
      )
    }) : []

  return (
    <Panel title='Collections' to='/collections'>
      <Stack spacing={4}>
        <Box>
          <Link to='/collections'>
            <Stat size='2xl' stat={count ? count : '-'} testId={testId} />
          </Link>
        </Box>
        <Box>
          <List>
            {items.slice(0, 5)}
          </List>
        </Box>
      </Stack>
    </Panel>
  )
}
