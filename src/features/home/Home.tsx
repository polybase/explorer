import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import useInterval from 'use-interval'
import { Input, InputGroup, InputRightElement, Stack, Box,  Container, VStack, SimpleGrid, IconButton } from '@chakra-ui/react'
import { Layout } from 'features/common/Layout'
import { Panel } from 'features/common/Panel'
import { useApi } from 'features/common/useApi'
import { Stat } from 'features/common/Stat'
import { EventList } from 'features/events/EventList'
import { List } from 'features/common/List'
import { ListLink } from 'features/common/ListLink'
import { CollectionPanel } from 'features/collections/CollectionPanel'
import { Map } from './Map'

export function Home () {
  const api = useApi()
  const [block, setBlock] = useState('-')


  useInterval(async () => {
    const res = await api.get('/v0/status')
    const block = res.data?.sync_info?.latest_block_height ?? '-'
    setBlock(block)
  }, 1000, true)

  const spacingX = 6
  const spacingY = 6

  return (
    <Layout maxW='container.xl'>
      <VStack>
        <Container maxW='container.xl' p={4} >
          <Box px={4}>
            <SimpleGrid columns={[1, 2, 3]} spacingX={spacingX} spacingY={spacingY}>
              <Stack spacing={spacingY}>
                <Box>
                  <InputGroup border='1px solid' borderRadius='lg' borderColor='bw.100' _dark={{ borderColor: 'transparent' }}>
                    <Input size='lg' fontWeight='semibold' variant='filled' placeholder='Search txn or block'  />
                    <InputRightElement height='100%' children={(
                      <Box pr={2}>
                        <IconButton color='bw.600' aria-label='Search' icon={<FaSearch />} />
                      </Box>
                    )}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <Panel title='Blocks'>
                    <Stack spacing={4}>
                      <Box>
                        <Stat size='2xl' stat={block} />
                      </Box>
                      <Box>
                        <EventList count={5} event='NewBlock' />
                      </Box>
                    </Stack>
                  </Panel>
                </Box>
                <Box>
                  <Link to='/collections'>
                    <CollectionPanel />
                  </Link>
                </Box>
              </Stack>
              <Stack spacing={spacingY}>
                <Box>
                  <Panel title='Events'>
                    <EventList count={5} />
                  </Panel>
                </Box>
                <Box>
                  <Panel title='Nodes'>
                    <Stack spacing={4}>
                      <Box>
                        <Stat size='2xl' stat={23} />
                      </Box>
                      <Box>
                        <Map highlight={[['181.8', '171.3'], ['229.3', '191.7'], ['717.6', '205.3'], ['738', '374.8'], ['392.1', '151']]} />
                      </Box>
                    </Stack>
                  </Panel>
                </Box>
              </Stack>
              <Stack spacing={spacingY}>
                <Box>
                  <Panel title='Alpha' bg='warning' color='whiteAlpha.900' _dark={{ color: 'whiteAlpha.800' }}>
                    <Box>
                   During Alpha, Polybase is running all the indexers (validators) on the network. All access to the decentralised database must be proxied through our gateway.
                    </Box>
                  </Panel>
                </Box>
                <Box>
                  <Panel title='Welcome'>
                    <Box color='bw.700'>
                    Polybase is a privacy preserving decentralised database, powered by ZK-STARKs.
                    </Box>
                  </Panel>
                </Box>
                <Box>
                  <Panel title='Quick Links'>
                    <List topDivider spacing={2} fontWeight='semibold'>
                      <ListLink href='https://docs.polybase.xyz' isExternal>
                      Docs
                      </ListLink>
                      <ListLink href='https://polybase.xyz/whitepaper' isExternal>
                      Whitepaper
                      </ListLink>
                      <ListLink href='https://social.testnet.polybase.xyz' isExternal>
                      Demo App
                      </ListLink>
                    </List>
                  </Panel>
                </Box>
                <Box>
                  <Panel title='Changelog'>
                    <Box color='bw.700'>
                      <b>2022-12-16</b>: Deploy new version of the Polybase explorer. Allow collections to be added via the explorer.
                    </Box>
                  </Panel>
                </Box>
              </Stack>
            </SimpleGrid>
          </Box>
        </Container>
      </VStack>
    </Layout>
  )
}

