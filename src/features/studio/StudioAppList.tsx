import { Box, Container, Heading, SimpleGrid, Stack, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { StudioLayout } from './StudioLayout'
import { Loading } from 'modules/loading/Loading'
import { getNamespaces, shortName } from './util'
import { useUserCollections } from './useUserCollections'
import { useCurrentUserId } from 'features/users/useCurrentUserId'

export function StudioAppList() {
  const { data, loading, error } = useUserCollections()
  const [publicKey] = useCurrentUserId()

  const namespaces = getNamespaces(data?.data || [])

  return (
    <Box>
      <StudioLayout>
        <Container maxW='container.xl'>
          <Box py={8}>
            <Stack spacing={4}>
              <Heading as='h1' size='xl'>Apps</Heading>
              <Button as={Link} to='/studio/create' size='md' maxW='10em' variant='primary'>Create App</Button>
              <Loading loading={loading}>
                <SimpleGrid columns={3} spacing={4}>
                  {namespaces.map((namespace) => {
                    return (
                      <Link to={`/studio/${encodeURIComponent(namespace)}`} key={namespace}>
                        <Box
                          minH='13em'
                          bg='bw.10'
                          border='1px solid'
                          borderColor='bw.100'
                          borderRadius='5px'
                          p={4}
                          boxShadow='md'
                        >
                          <Stack>
                            <Heading as='h2' fontSize='xl' fontWeight={700}>{shortName(namespace)}</Heading>
                            <Heading as='h3' fontSize='md' color='bw.600' fontWeight={400}>{namespace}</Heading>
                          </Stack>
                        </Box>
                      </Link>
                    )
                  })}
                </SimpleGrid>
                <Box color='blackAlpha.600'>
                  PublicKey: {publicKey}
                </Box>
              </Loading>
            </Stack>
          </Box>
        </Container>
      </StudioLayout>
    </Box >
  )
}

