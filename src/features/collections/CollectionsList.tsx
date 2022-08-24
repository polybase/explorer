import React from 'react'
import { Box, Heading, Stack, Container, VStack } from '@chakra-ui/react'
import { map } from 'lodash'
import { Link } from 'react-router-dom'
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
      <Link to={`/collections/${item.data.id}`} key={item.data.id}>
        <Box bg='bw.50' borderRadius='md' p={4}>
          <Heading size='md'>{item.data.id}</Heading>
        </Box>
      </Link>
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