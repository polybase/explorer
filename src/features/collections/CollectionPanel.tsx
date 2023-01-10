import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Stack, Box, HStack, Heading  } from '@chakra-ui/react'
import useInterval from 'use-interval'
import { usePolybase, useCollection } from '@polybase/react'
import { CollectionMetaEx } from '../types'
import { useApi } from 'features/common/useApi'
import { Stat } from 'features/common/Stat'
import { Panel } from 'features/common/Panel'
import { List } from 'features/common/List'


export interface CollectionPanelProps {
  pk?: string|null
}

export function CollectionPanel ({ pk }: CollectionPanelProps) {
  const api = useApi()
  const [count, setCount] = useState('-')
  const polybase = usePolybase()
  const query = polybase
    .collection('Collection')
    .limit(100)


  const { data } = useCollection<CollectionMetaEx>(
    pk
      ? query.where('publicKey', '==', pk)
      : query.sort('lastRecordUpdated', 'desc'),
  )

  // TODO: Replace this with a better count
  useInterval(async () => {
    if (pk) {
      setCount(`${data?.data?.length ?? '0'}`)
      return
    }
    const res = await api.get('/v0/collections')
    const count = res.data?.count
    setCount(count)
  }, 1000, true)

  const items = data?.data ? data?.data
    .filter(({ data }) => !!data.lastRecordUpdated)
    .map((item) => {
      return (
        <HStack key={item.data.id}>
          <Stack spacing={1}>
            <Box>
              <Link to={`/collections/${encodeURIComponent(item.data.id)}`}>
                <Box p={1}>
                  <Heading display='block' size='xs' >{item.data.id}</Heading>
                </Box>
              </Link>
            </Box>
          </Stack>
        </HStack>
      )
    }) : []

  return (
    <Panel title='Collections'>
      <Stack spacing={4}>
        <Box>
          <Stat size='2xl' stat={count ? count : '-'} />
        </Box>
        <Box>
          <List>
            {items.slice(0,5)}
          </List>
        </Box>
      </Stack>
    </Panel>
  )
}