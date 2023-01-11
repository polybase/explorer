import { Stack, Container } from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'


export interface PaginationProps {
  page: number,
  setPage: (page: number) => void,
  pageLength: number,
  items: ReactElement[],
}


export default function Pagination ({ page, setPage, pageLength, items }: PaginationProps) {

  const [hasMore, setHasMore] = useState(true)

  const fetchData = () => {
    if (items.length >= page * pageLength) {
      setHasMore(true)
      setPage(page + 1)
      return items
    }else  if(items.length < pageLength){
      setHasMore(false)
      return items
    }
    setHasMore(false)
    return items
  }

  return (
    <Container maxW='container.md' p={4} alignSelf={'center'} >
      <InfiniteScroll
        dataLength={items.length}
        next={fetchData}
        hasMore={hasMore}
        loader={'Loading...'}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Stack spacing={4}>
          {items}
        </Stack>
      </InfiniteScroll>
    </Container>
  )
}