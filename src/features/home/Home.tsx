import { useState } from 'react'
import { Input, Stack, HStack, Box } from '@chakra-ui/react'
import { Layout } from 'features/common/Layout'
import { useApi } from 'features/common/useApi'
import useInterval from 'use-interval'
import { Stat } from './Stat'

export function Home () {
  const api = useApi()
  const [block, setBlock] = useState('-')

  useInterval(async () => {
    const res = await api.get('/v0/status')
    console.log(res.data)
    const block = res.data?.sync_info?.latest_block_height ?? '-'
    setBlock(block)
  }, 1000, true)

  return (
    <Layout>
      <Box>
        <Stack spacing='6'>
          <Stack>
            <Input size='lg' placeholder='Search for a txn'  />
          </Stack>
          <Stack spacing={6}>
            <Stat title='Block' stat={block} />
            <HStack spacing={6}>
              <Stat title='Validators' stat={4} />
              <Stat title='Collections' stat={1} />
            </HStack>
          </Stack>
        </Stack>
      </Box>
    </Layout>
  )
}

