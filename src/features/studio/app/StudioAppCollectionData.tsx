import { useEffect, useState } from 'react'
import { map } from 'lodash'
import { CollectionMeta } from '@polybase/client'
import { usePolybase, useCollection, useDocument } from '@polybase/react'
import { parse, Program } from '@polybase/polylang'
import { Box, Stack } from '@chakra-ui/react'
import { Cell } from 'react-table'
import { Loading } from 'modules/loading/Loading'
import Table from 'modules/table/Table'

const LIMIT = 100
export interface StudioAppCollectionsDataProps {
  collectionId: string
}

export function StudioAppCollectionData({ collectionId }: StudioAppCollectionsDataProps) {
  const polybase = usePolybase()
  const [pageIndex, setPageIndex] = useState(0)
  const [ast, setAst] = useState<Program>()

  // Structure for the table
  const { data: meta, loading: loadingMeta, error: metaError } = useDocument<CollectionMeta>(
    collectionId ? polybase.collection('Collection').record(collectionId) : null,
  )

  const { data, loading: loadingData, error: dataErr } = useCollection<any>(
    collectionId ? polybase.collection(collectionId).limit(LIMIT * (pageIndex + 1)) : null,
  )

  const shortCollectionName = (id: string) => id.split('/').pop()?.replace(/-/g, '_')

  useEffect(() => {
    if (!meta?.data?.code) {
      return
    }

    parse(meta?.data?.code, collectionId).then(([ast]) => setAst(ast))
  }, [meta?.data?.code, collectionId])

  const fields = ast?.nodes?.find(node => node?.Collection?.name === shortCollectionName(collectionId || ''))?.Collection?.items?.map((item: any) => item?.Field)?.filter(Boolean)

  const columns = map(fields, (field) => {
    return {
      accessor: `data.${field.name}`,
      Header: field.name,
      Cell: ({ cell }: { cell: Cell<any> }) => {
        const str =
          cell.value === undefined
            ? '-'
            : JSON.stringify(cell.value)
        return <Box>{str.length > 100 ? `${str.substring(0, 100)}...` : str}</Box>
      },
    }
  })


  if (!collectionId) return null

  return (
    <Box height='100%' overflowX='auto'>
      <Table<any>
        columns={columns}
        data={data?.data ?? []}
        // onChange={onChangeHandler}
        hasMore={!loadingData && LIMIT * pageIndex < (data?.data ?? [])?.length}
        loadMore={() => {
          if (loadingData) return
          setPageIndex((i) => i + 1)
        }}
      />
    </Box>
  )
}
