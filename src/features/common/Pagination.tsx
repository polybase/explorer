import { Stack, Container } from '@chakra-ui/react'
import InfiniteScroll from 'react-infinite-scroll-component'


export interface PaginationProps {
  page: number,
  setPage: any,
  pageLength: number,
  items: any,
}

export default function Pagination ({ page, setPage, pageLength, items }: PaginationProps) {

  let pageItems = items.slice(0, pageLength * page)

  const fetchData = () => {
    setPage(page + 1)
    pageItems.concat(items.slice(pageLength * (page - 1), pageLength * page))
    return pageItems
  }

  return (

    <Container maxW='container.md' p={4} alignSelf={'center'} >
      <Stack spacing={4}>
        <InfiniteScroll
          dataLength={pageItems.length}
          next={fetchData}
          hasMore={true}
          loader={''}
        >
          {pageItems}
        </InfiniteScroll>
      </Stack>
    </Container>
  )
}