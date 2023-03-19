import { Box, Heading } from '@chakra-ui/react'
import { map } from 'lodash'
import { Link } from 'react-router-dom'
import { CollectionMeta } from '@polybase/client'
import { usePolybase, useCollection } from '@polybase/react'
import { Loading } from 'modules/loading/Loading'
import Pagination from 'features/common/Pagination'
import { PaginationProps } from 'features/common/Pagination'
import { useRef, useState } from 'react'

export interface CollectionListProps {
  pk?: string | null,
}

const PAGE_LENGTH = 100

export function CollectionList({ pk }: CollectionListProps) {
  const polybase = usePolybase()

  const [page, setPage] = useState(1)

  const query = polybase
    .collection('Collection').limit(page * PAGE_LENGTH)

  const { data, loading, error } = useCollection<CollectionMeta>(
    pk
      ? query.where('publicKey', '==', pk)
      : query.sort('lastRecordUpdated', 'desc'),
  )

  const items = map(data?.data, (item) => {
    return (
      <Link to={`/collections/${encodeURIComponent(item.data.id)}`} key={item.data.id}>
        <Box bg='bw.50' borderRadius='md' p={4}>
          <Heading size='md'>{item.data.id}</Heading>
        </Box>
      </Link>
    )
  })

  const ref: any = useRef([])
  if (items) {
    ref.current = items
  }

  const pageProps: PaginationProps = {
    page: page || 1,
    setPage,
    pageLength: PAGE_LENGTH,
    items: ref.current,
  }

  return (
    <Loading loading={loading && items.length === 0}>
      {error && <Box color='error'>{error.message}</Box>}
      <Pagination {...pageProps}></Pagination>
    </Loading>
  )
}