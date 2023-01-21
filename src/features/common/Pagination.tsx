import { Stack, Container, Box } from '@chakra-ui/react'
import { ReactElement } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'


export interface PaginationProps {
  page: number,
  setPage: (page: number) => void,
  pageLength: number,
  items: ReactElement[],
}


export default function Pagination ({ page, setPage, pageLength, items }: PaginationProps) {
  const fetchData = () => {
    setPage(page + 1)
    return items
  }

  return (
    <Box>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchData}
        hasMore={items.length >= page * pageLength ?  true : false}
        loader={'Loading...'}
        endMessage={
          <Box textAlign='center' p={10}>
            <b>That's the end, that's everything!</b>
          </Box>
        }
      >
        <Stack spacing={4}>
          {items}
        </Stack>
      </InfiniteScroll>
    </Box>
  )
}