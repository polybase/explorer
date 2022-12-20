import { useState } from 'react'
import { Stack, Box } from '@chakra-ui/react'
import useInterval from 'use-interval'
import { useApi } from 'features/common/useApi'
import { Stat } from 'features/common/Stat'
import { Panel } from 'features/common/Panel'


export function CollectionPanel () {
  const api = useApi()
  const [count, setCount] = useState('-')

  useInterval(async () => {
    const res = await api.get('/v0/collections')
    const count = res.data?.count
    setCount(count)
  }, 1000, true)

  return (
    <Panel title='Collections'>
      <Stack spacing={4}>
        <Box>
          <Stat size='2xl' stat={count ? count : '-'} />
        </Box>
        {/* <Box>
          <CollectionsShortList />
        </Box> */}
      </Stack>
    </Panel>
  )
}