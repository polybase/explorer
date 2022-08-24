import React, { useState } from 'react'
import { Box, Heading, Stack, Container, VStack } from '@chakra-ui/react'
import { map } from 'lodash'
import { Cell } from 'react-table'
import Table from 'modules/table/Table'
import { useSpacetime } from 'modules/spacetime/useSpacetime'
import { useDocument } from 'modules/spacetime/useDocument'
import { Layout } from 'features/common/Layout'
import { Loading } from 'modules/loading/Loading'
import { useParams } from 'react-router-dom'
import { CollectionMeta } from '@spacetimexyz/client'
import { useCollection } from 'modules/spacetime/useCollection'

const LIMIT = 20

export function CollectionsDetail () {
  const { collectionId } = useParams()
  const [pageIndex, setPageIndex] = useState(0)
  const spacetime = useSpacetime()

  // Structure for the table
  const { data: meta, loading: loadingMeta, error: metaError } = useDocument<CollectionMeta>(
    collectionId ? spacetime.collection('$collections').doc(collectionId) : null,
  )

  const { data, loading: loadingData, error: dataErr } = useCollection<any>(
    collectionId ? spacetime.collection(collectionId): null,
  )

  const columns = map(meta?.schema?.properties, (_, key) => {
    return {
      accessor: key,
      Header: key,
      Cell: ({ cell }: { cell: Cell<any> }) => {
        const str = cell.value ? JSON.stringify(cell.value) : '-'
        return <Box>{str.length > 100 ? `${str.substring(0, 100)}...` : cell.value }</Box>
      },
    }
  })

  return (
    <Layout>
      <Loading loading={loadingData || loadingMeta}>
        <Stack spacing={4}>
          <Stack spacing={4} p={4}>
            <Heading>{meta?.id}</Heading>
            <Stack>
              {metaError && <Box color='error'>Failed to fetch metadata: {metaError.message}</Box>}
              {dataErr && <Box color='error'>Failed to records: {dataErr.message}</Box>}
            </Stack>
          </Stack>
          <Stack spacing={4}>
            <Box width='100%'>
              <Table<any>
                columns={columns}
                data={data ?? []}
                // onChange={onChangeHandler}
                hasMore={!loadingData && LIMIT * (pageIndex + 1) <= (data ?? [])?.length}
                loadMore={() => {
                  if (loadingData) return
                  setPageIndex((i) => i + 1)
                }}
              />
            </Box>
          </Stack>
        </Stack>
      </Loading>
    </Layout>
  )
}