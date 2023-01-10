import { Heading, Stack, Container, VStack } from '@chakra-ui/react'
import { Layout } from 'features/common/Layout'
import { CollectionList } from './CollectionList'

export function CollectionListPage () {
  return (
    <Layout maxW='container.xl'>
      <VStack>
        <Container maxW='container.xl'>
          <Stack spacing={4} p={4}>
            <Heading>Collections</Heading>
            <CollectionList />
          </Stack>
        </Container>
      </VStack>
    </Layout>
  )
}