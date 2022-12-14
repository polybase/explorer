import React, { useEffect, useState } from 'react'
import { Box, Heading, Stack } from '@chakra-ui/react'
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

  return (
    <Layout>
      <Loading loading={loadingData || loadingMeta}>
        <Stack spacing={4} p={4}>
          <Stack spacing={4}>
            <Heading size='md' color='bw.800' textTransform='uppercase'>
              Collection details
            </Heading>
            <Heading>{meta?.data.id}</Heading>
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
      </Loading>
    </Layout>
  )
}