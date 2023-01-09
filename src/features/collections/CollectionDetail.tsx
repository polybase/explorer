import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Stack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from '@chakra-ui/react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'
import { map } from 'lodash'
import { Cell } from 'react-table'
import Table from 'modules/table/Table'
import { usePolybase, useCollection, useDocument } from '@polybase/react'
import { Layout } from 'features/common/Layout'
import { Loading } from 'modules/loading/Loading'
import { useParams } from 'react-router-dom'
import { CollectionMeta } from '@polybase/client'
import { parse, Program } from '@polybase/polylang'
import { CollectionDetailData } from './CollectionDetailData'


export function CollectionsDetail () {
  const { collectionId } = useParams()
  const [pageIndex, setPageIndex] = useState(0)
  const polybase = usePolybase()
  const [ast, setAst] = useState<Program>()

  // Structure for the table
  const { data: meta, loading: loadingMeta, error: metaError } = useDocument<CollectionMeta>(
    collectionId ? polybase.collection('Collection').doc(collectionId) : null,
  )

  useEffect(() => {
    if (!meta?.data?.code) {
      return
    }

    parse(meta?.data?.code).then(ast => setAst(ast))
  }, [meta?.data?.code])


  const collectionPath = meta?.data.id.split('/').slice(0, -1)
  const collectionName = meta?.data.id.split('/').pop()
  const tabPaths = ['/', '/schema']

  if (!collectionId) return null

  return (
    <Layout maxW='container.xl'>
      <Loading loading={loadingMeta}>
        <Container maxW='container.xl'>
          <Stack spacing={4} p={4}>
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
              <Stack>
                {metaError && <Box color='error'>Failed to fetch metadata: {metaError.message}</Box>}
              </Stack>
            </Stack>
            <Stack spacing={4}>
              <Box width='100%'>
                <CollectionDetailData collectionId={collectionId} />
              </Box>
            </Stack>
          </Stack>
        </Container>

      </Loading>
    </Layout>
  )
}