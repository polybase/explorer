import { Flex, Box, Stack, Button } from '@chakra-ui/react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { StudioAppCollectionData } from './StudioAppCollectionData'
import { useUserCollections } from '../useUserCollections'
import { getCollections, shortName } from '../util'

export interface StudioAppCollectionsProps {
  namespace: string
}

export function StudioAppCollections({ namespace }: StudioAppCollectionsProps) {
  const { data } = useUserCollections()
  const { collectionName } = useParams()
  const location = useLocation()

  const collections = getCollections(namespace, data?.data)

  if (!collectionName) return null

  const collectionId = `${namespace}/${collectionName}`

  return (
    <Flex height='100%'>
      <Box height='100%' borderRight='1px solid' borderColor='bw.100' width='13em'>
        <Stack p={4}>
          {collections.map((collection) => {
            const url = `/studio/${encodeURIComponent(namespace)}/collections/${shortName(collection.data.id)}`
            const match = location.pathname === url
            return (
              <Button key={url} as={Link} to={url} variant={match ? 'solid' : 'ghost'} justifyContent='left' opacity={match ? 1 : 0.5}>
                {shortName(collection.data.id)}
              </Button>
            )
          })}
        </Stack>
      </Box>
      {collectionName && (
        <Box flex='1 1 auto' height='100%' minW='0'>
          <StudioAppCollectionData collectionId={collectionId} />
        </Box>
      )}
    </Flex>
  )
}
