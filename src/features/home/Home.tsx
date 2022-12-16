import { useState } from 'react'
import { Input, InputGroup, InputRightElement, Stack, Box,  Container, VStack, SimpleGrid, IconButton } from '@chakra-ui/react'
import { CollectionMeta } from '@polybase/client'
import { usePolybase, useCollection } from '@polybase/react'
import { Layout } from 'features/common/Layout'
import { Panel } from 'features/common/Panel'
import { useApi } from 'features/common/useApi'
import useInterval from 'use-interval'
import { StatBox } from './StatBox'
import { Stat } from './Stat'
import { FaSearch } from 'react-icons/fa'

export function Home () {
  const polybase = usePolybase()
  const api = useApi()
  const [block, setBlock] = useState('-')

  useInterval(async () => {
    const res = await api.get('/v0/status')
    const block = res.data?.sync_info?.latest_block_height ?? '-'
    setBlock(block)
  }, 1000, true)

  const { data } = useCollection<CollectionMeta>(polybase.collection('Collection'))

  const spacingX = 6
  const spacingY = 6

  return (
    <Layout>
      <VStack>
        <Container maxW='container.xl' p={4} >
          <Box px={4}>
            <SimpleGrid columns={[1, 2, 3]} spacingX={spacingX} spacingY={spacingY}>
              <Stack spacing={spacingY}>
                <Box>
                  <InputGroup>
                    <Input size='lg' fontSize='sm' fontWeight='semibold' textTransform='uppercase' variant='filled' placeholder='Search txn or block' colorScheme='brand'  />
                    <InputRightElement height='100%' children={(
                      <Box pr={2}>
                        <IconButton color='bw.600' aria-label='Search' icon={<FaSearch />} />
                      </Box>
                    )}
                    />
                  </InputGroup>
                </Box>
                <Panel title='Blocks'>
                  <Box>
                    <Stat size='2xl' stat={block} />
                  </Box>
                </Panel>
              </Stack>
              <Stack spacing={spacingY}>
                <Panel title='Events'>
                  <Box>

                  </Box>
                </Panel>
                <Box>
                  <StatBox title='Validators' stat={4} />
                </Box>
              </Stack>
              <Stack spacing={spacingY}>
                <Panel title='Alpha' bg='warning' color='whiteAlpha.900' _dark={{ color: 'whiteAlpha.800' }}>
                  <Box fontSize='sm'>
                  During Alpha, Polybase is running all the indexers (validators) on the network. All access to the decentralised database must be proxied through our gateway.
                  </Box>
                </Panel>
                <Panel title='Welcome'>
                  <Box fontSize='sm' color='bw.700'>
                    Polybase is a decentralised database, powered by ZK-STARKs.
                  </Box>
                </Panel>
                <Panel title='Quick Links'>
                  <Box>

                  </Box>
                </Panel>
                <Box>
                  <StatBox title='Collections' to='/collections' stat={data ? data?.data?.length : '-'} />
                </Box>
                <Box>
                  <Stack spacing='6'>
                    <Stack spacing={6}>
                      <StatBox title='Block' stat={block} />
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </SimpleGrid>
          </Box>
        </Container>
      </VStack>
    </Layout>
  )
}

