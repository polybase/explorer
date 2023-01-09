import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Stack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from '@chakra-ui/react'
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

const LIMIT = 20

export function CollectionsDetail () {
  const { collectionId } = useParams()
  const [pageIndex, setPageIndex] = useState(0)
  const polybase = usePolybase()
  const [ast, setAst] = useState<Program>()

  // Structure for the table
  const { data: meta, loading: loadingMeta, error: metaError } = useDocument<CollectionMeta>(
    collectionId ? polybase.collection('Collection').doc(collectionId) : null,
  )

  const { data, loading: loadingData, error: dataErr } = useCollection<any>(
    collectionId ? polybase.collection(collectionId): null,
  )

  useEffect(() => {
    if (!meta?.data?.code) {
      return
    }

    parse(meta?.data?.code).then(ast => setAst(ast))
  }, [meta?.data?.code])

  const shortCollectionName = (id: string) => id.split('/').pop()?.replace(/-/g, '_')

  const fields = ast?.nodes?.find(node => node?.Collection?.name === shortCollectionName(collectionId || ''))?.Collection?.items?.map((item: any) => item?.Field)?.filter(Boolean)

  const columns = map(fields, (field) => {
    return {
      accessor: `data.${field.name}`,
      Header: field.name,
      Cell: ({ cell }: { cell: Cell<any> }) => {
        const str = cell.value ? JSON.stringify(cell.value) : '-'
        return <Box>{str.length > 100 ? `${str.substring(0, 100)}...` : str }</Box>
      },
    }
  })

  const collectionPath = meta?.data.id.split('/').slice(0, -1)
  const collectionName = meta?.data.id.split('/').pop()

  return (
    <Layout maxW='container.xl'>
      <Loading loading={loadingData || loadingMeta}>
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
                {dataErr && <Box color='error'>Failed to records: {dataErr.message}</Box>}
              </Stack>
            </Stack>
            <Stack spacing={4}>
              <Box width='100%'>
                <Table<any>
                  columns={columns}
                  data={data?.data ?? []}
                  // onChange={onChangeHandler}
                  hasMore={!loadingData && LIMIT * (pageIndex + 1) <= (data?.data ?? [])?.length}
                  loadMore={() => {
                    if (loadingData) return
                    setPageIndex((i) => i + 1)
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        </Container>

      </Loading>
    </Layout>
  )
}