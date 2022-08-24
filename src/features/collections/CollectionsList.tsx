import React from 'react'
import { Box, Heading, Stack, Container, VStack } from '@chakra-ui/react'
import { map } from 'lodash'
import { CollectionMeta } from '@spacetimexyz/client'
import { useSpacetime } from 'modules/spacetime/useSpacetime'
import { useCollection } from 'modules/spacetime/useCollection'
import { Layout } from 'features/common/Layout'
import { Loading } from 'modules/loading/Loading'

export function CollectionsList () {
  const spacetime = useSpacetime()
  const { data, loading, error } = useCollection<CollectionMeta>(spacetime.collection('$collections'))

  const items = map(data, (item) => {
    return (
      <Box bg='bw.50' borderRadius='md' p={4} key={item.id}>
        <Heading size='md'>{item.id}</Heading>
      </Box>
    )
  })

  return (
    <Layout>
      <VStack>
        <Container maxW='container.md' p={4}>
          <Stack spacing={4}>
            <Heading>Collections</Heading>
            <Loading loading={loading}>
              {error && <Box color='error'>{error.message}</Box>}
              <Stack spacing={4}>
                {items}
              </Stack>
            </Loading>
          </Stack>
        </Container>
      </VStack>
    </Layout>
  )
}