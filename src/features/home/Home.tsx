import { useState } from 'react'
import useInterval from 'use-interval'
import { Link as ChakraLink, Stack, Box, Container, VStack, SimpleGrid, Tag, HStack } from '@chakra-ui/react'
import { Layout } from 'features/common/Layout'
import { Panel } from 'features/common/Panel'
import { useApi } from 'features/common/useApi'
import { Stat } from 'features/common/Stat'
import { List } from 'features/common/List'
import { ListLink } from 'features/common/ListLink'
import { CollectionPanel } from 'features/collections/CollectionPanel'
import { Map } from './Map'
// import { CollectionRecord } from '@polybase/client'
import { useCollection, usePolybase, useRecordOnce } from '@polybase/react'

const changeTypeColors: Record<Change['type'], string> = {
  added: 'green',
  changed: 'yellow',
  fixed: 'blue',
  removed: 'red',
  deprecated: 'gray',
}

export interface Change {
  id: string
  type: 'added' | 'changed' | 'fixed' | 'removed' | 'deprecated'
  desc: string
  tags: string[]
  release: { id: string }
}

export function Home() {
  const api = useApi()
  const [block, setBlock] = useState('-')
  const polybase = usePolybase()

  const { data: changelog } = useCollection(
    polybase.collection<Change>('/polybase/apps/changelog/Change')
      .sort('date', 'desc')
      .limit(5),
  )


  useInterval(async () => {
    const res = await api.get('/v0/status')
    const block = res.data?.root ?? '-'
    setBlock(`0x${block}`)
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
                {/* <Box>
                  <InputGroup border='1px solid' borderRadius='lg' borderColor='bw.100' _dark={{ borderColor: 'transparent' }}>
                    <Input size='lg' fontWeight='semibold' variant='filled' placeholder='Search txn or block'  />
                    <InputRightElement height='100%' children={(
                      <Box pr={2}>
                        <IconButton color='bw.600' aria-label='Search' icon={<FaSearch />} />
                      </Box>
                    )}
                    />
                  </InputGroup>
                </Box> */}
                <Box>
                  <Panel title='Root Hash'>
                    <Stack spacing={4}>
                      <Box>
                        <Stat size='lg' stat={block} testId='root-hash'/>
                      </Box>
                      <Box>
                        {/* <EventList count={5} event='NewBlock' /> */}
                      </Box>
                    </Stack>
                  </Panel>
                </Box>
                <Box>
                  <CollectionPanel testId='collection-amount' />
                </Box>
              </Stack>
              <Stack spacing={spacingY}>
                {/* <Box>
                  <Panel title='Events'>
                    <EventList count={5} />
                  </Panel>
                </Box> */}
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
                  <Panel title={process.env.REACT_APP_ENV_NAME ?? 'testnet'}>
                    <Box>
                      Polybase currently runs all the indexers on the network and requests are proxied through our gateway. We are committed to decentralisation, and you can find our <ChakraLink fontWeight='bold' isExternal href='https://polybase.xyz/blog/roadmap-2023'>decentralisation roadmap</ChakraLink> here.
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
                    <Stack color='bw.700'>
                      {changelog?.data.map((change) => {
                        return (
                          <ChangeItem key={change.data.id} change={change.data} />
                        )
                      }).filter((v) => !!v).slice(3)}
                      <Box>
                        <ListLink href='https://polybase.xyz/changelog' isExternal>
                          Changelog
                        </ListLink>
                      </Box>
                    </Stack>

                  </Panel>
                </Box>
              </Stack>
            </SimpleGrid>
          </Box>
        </Container >
      </VStack >
    </Layout >
  )
}

export interface ChangeItemProps {
  change: Change
}
function ChangeItem({ change }: ChangeItemProps) {
  const polybase = usePolybase()
  const release = useRecordOnce(polybase.collection('/polybase/apps/changelog/Release').record(change.release?.id))

  if (!release.data?.data.published) return null

  return (
    <HStack spacing={3}>
      <Box flex='0 0 auto'>
        <Tag
          colorScheme={changeTypeColors[change.type]}
          userSelect='none'>{change.type}</Tag>
      </Box>
      <Box>
        {change.desc}
      </Box>
    </HStack>
  )
}

