import { useState } from 'react'
import { Input, Stack, Box,  Container, VStack, SimpleGrid } from '@chakra-ui/react'
import { ContractMeta } from '@polybase/client'
import { usePolybase, useContract } from '@polybase/react'
import { Layout } from 'features/common/Layout'
import { useApi } from 'features/common/useApi'
import useInterval from 'use-interval'
import { Stat } from './Stat'

export function Home () {
  const polybase = usePolybase()
  const api = useApi()
  const [block, setBlock] = useState('-')

  useInterval(async () => {
    const res = await api.get('/v0/status')
    const block = res.data?.sync_info?.latest_block_height ?? '-'
    setBlock(block)
  }, 1000, true)

  const { data } = useContract<ContractMeta>(polybase.contract('$Contract'))

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
                <SimpleGrid columns={[1, 2]} spacingX={6} spacingY={6}>
                  <Box>
                    <Stat title='Validators' stat={4} />
                  </Box>
                  <Box>
                    <Stat title='Contracts' to='/contracts' stat={data ? data?.data?.length : '-'} />
                  </Box>
                </SimpleGrid>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </VStack>
    </Layout>
  )
}

