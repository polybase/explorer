import React from 'react'
import { Box, Heading, Stack } from '@chakra-ui/react'
import { map } from 'lodash'
import { Cell } from 'react-table'
import Table from 'modules/table/Table'
import { usePolybase, useDocument } from '@polybase/react'
import { Layout } from 'features/common/Layout'
import { Loading } from 'modules/loading/Loading'
import { useParams } from 'react-router-dom'
import { CollectionMeta } from '@polybase/client'

export function RecordDetail () {
  const { collectionId, recordId } = useParams()
  const polybase = usePolybase()

  // Structure for the table
  const { data, loading, error } = useDocument<CollectionMeta>(
    (collectionId && recordId) ? polybase.collection(collectionId).record(recordId) : null,
  )

  const fields = Object.keys({ ...data?.data })
  const columns = map(fields, (field) => {
    return {
      accessor: field,
      Header: field,
      Cell: ({ cell }: { cell: Cell<any> }) => {
        const str = cell.value ?? '-'
        return <Box>{str.length > 100 ? `${str.substring(0, 100)}...` : str }</Box>
      },
    }
  })

  return (
    <Layout>
      <Loading loading={loading}>
        <Stack spacing={4} p={4}>
          <Stack spacing={4} >
            <Heading size='md' color='bw.800' textTransform='uppercase'>
              Record details
            </Heading>
            <Heading>{data?.data.id}</Heading>
            <Stack>
              {error && <Box color='error'>Failed to fetch record: {error.message}</Box>}
            </Stack>
          </Stack>
          <Stack spacing={4}>
            <Table<any>
              columns={columns}
              data={[data?.data]}
              loadMore={() => {}}
            />
          </Stack>
        </Stack>
      </Loading>
    </Layout>
  )
}