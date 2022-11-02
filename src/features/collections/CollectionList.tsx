import React from 'react'
import { Box, Heading, Stack, Container, VStack } from '@chakra-ui/react'
import { map } from 'lodash'
import { Link } from 'react-router-dom'
import { CollectionMeta } from '@polybase/client'
import { usePolybase, useCollection } from '@polybase/react'
import { Layout } from 'features/common/Layout'
import { Loading } from 'modules/loading/Loading'

export function CollectionsList () {
  const polybase = usePolybase()
  const { data, loading, error } = useCollection<CollectionMeta>(polybase.collection('Collection'))

  const items = map(data?.data, (item) => {
    return (
      <Link to={`/collections/${encodeURIComponent(item.data.id)}`} key={item.data.id}>
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