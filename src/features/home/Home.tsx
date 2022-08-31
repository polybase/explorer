import { useState } from 'react'
import { Input, Stack, HStack, Box,  Container, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { CollectionMeta } from '@spacetimexyz/client'
import { useSpacetime, useCollection } from '@spacetimexyz/react'
import { Layout } from 'features/common/Layout'
import { useApi } from 'features/common/useApi'
import useInterval from 'use-interval'
import { Stat } from './Stat'

export function Home () {
  const spacetime = useSpacetime()
  const api = useApi()
  const [block, setBlock] = useState('-')

  useInterval(async () => {
    const res = await api.get('/v0/status')
    const block = res.data?.sync_info?.latest_block_height ?? '-'
    setBlock(block)
  }, 1000, true)

  const { data } = useCollection<CollectionMeta>(spacetime.collection('$collections'))

  return (
    <Layout>
      <VStack>
        <Container size='lg' p={4}>
          <Box>
            <Stack spacing='6'>
              <Stack>
                <Input size='lg' placeholder='Search for a txn'  />
              </Stack>
              <Stack spacing={6}>
                <Stat title='Block' stat={block} />
                <HStack spacing={6}>
                  <Stat title='Validators' stat={4} />
                  <Link to='collections'>
                    <Stat title='Collections' stat={data ? data?.length : '-'} />
                  </Link>
                </HStack>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </VStack>
    </Layout>
  )
}

