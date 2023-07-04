import { Heading, Stack, Container } from '@chakra-ui/react'
import { Layout } from 'features/common/Layout'
import { CollectionList } from './CollectionList'

export function CollectionListPage () {
  return (
    <Layout maxW='container.xl'>
      <Container maxW='container.xl'>
        <Stack spacing={4} p={4}>
          <Heading>Collections</Heading>
          <CollectionList testId='collection-list-item'/>
        </Stack>
      </Container>
    </Layout>
  )
}