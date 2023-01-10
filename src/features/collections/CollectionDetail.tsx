import { Link } from 'react-router-dom'
import { Box, Heading, Stack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from '@chakra-ui/react'
import { FaChevronRight } from 'react-icons/fa'
import { usePolybase, useDocument } from '@polybase/react'
import { Layout } from 'features/common/Layout'
import { Loading } from 'modules/loading/Loading'
import { useParams } from 'react-router-dom'
import { CollectionMeta } from '@polybase/client'
import { CollectionDetailData } from './CollectionDetailData'
import { TabRouter } from 'features/common/TabRouter'
import { CollectionDetailSchema } from './CollectionDetailSchema'


export function CollectionsDetail () {
  const { collectionId } = useParams()
  const polybase = usePolybase()

  // Structure for the table
  const { data: meta, loading: loadingMeta, error: metaError } = useDocument<CollectionMeta>(
    collectionId ? polybase.collection('Collection').record(collectionId) : null,
  )

  const collectionPath = meta?.data.id.split('/').slice(0, -1)
  const collectionName = meta?.data.id.split('/').pop()

  if (!collectionId) return null

  const tabs = [{
    title: 'Data',
    path: '',
    element: <CollectionDetailData collectionId={collectionId} />,
  }, {
    title: 'Schema',
    path: '/schema',
    element: <CollectionDetailSchema collectionId={collectionId} />,
  }]

  return (
    <Layout maxW='container.xl'>
      <Loading loading={loadingMeta}>
        <Container maxW='container.xl' height='100%'>
          <Stack spacing={4} p={4} height='100%'>
            <Stack spacing={4}>
              <Breadcrumb
                color='bw.700'
                spacing='8px'
                separator={<FaChevronRight size='10px' />}
              >
                <BreadcrumbItem key='collection'>
                  <BreadcrumbLink as={Link} to='/collections'>Collections</BreadcrumbLink>
                </BreadcrumbItem>
                {collectionPath?.map((part) => {
                  return (
                    <BreadcrumbItem key={part}>
                      <BreadcrumbLink>{part}</BreadcrumbLink>
                    </BreadcrumbItem>
                  )
                })}
              </Breadcrumb>
              <Heading>{collectionName}</Heading>
              {metaError && <Box color='error'>Failed to fetch metadata: {metaError.message}</Box>}
            </Stack>
            <Stack spacing={4} flex='1 1 auto'>
              <TabRouter
                flex='1 1 auto'
                display='flex'
                height='100%'
                flexDirection='column'
                prefix={`/collections/${encodeURIComponent(collectionId)}`}
                tabs={tabs}
              />
            </Stack>
          </Stack>
        </Container>

      </Loading>
    </Layout>
  )
}