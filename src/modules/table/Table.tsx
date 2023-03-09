import React, { useMemo, useEffect, useRef } from 'react'
import { css } from '@emotion/react'
import { Box, Flex } from '@chakra-ui/react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  useTable,
  // usePagination,
  useBlockLayout,
  useResizeColumns,
  TableOptions,
  TableInstance,
  TableState,
  HeaderGroup,
  UseTableOptions,
  UsePaginationInstanceProps,
  UseResizeColumnsColumnProps,
  UseResizeColumnsState,
  UsePaginationOptions,
} from 'react-table'

export type TableInstanceWithHooks<T extends Record<string, any>> = UsePaginationInstanceProps<T> & TableInstance<T>

export interface HeaderGroupProps<T extends Record<string, any>> extends UseResizeColumnsColumnProps<T>, HeaderGroup<T> {
  headers: Array<HeaderGroupProps<T>>
}

export interface TableInstanceState<T extends Record<string, any>> extends UseResizeColumnsState<T> {
  pageIndex: number
  pageSize: number
}
export interface TableInstanceWithState<T extends Record<string, any>> extends TableInstanceWithHooks<T> {
  state: TableState<T>
  headerGroups: Array<HeaderGroupProps<T>>
}

export interface AllUseTableOptions<D extends Record<string, any>> extends UseTableOptions<D>, UsePaginationOptions<D> { }

export interface TableProps<T extends Record<string, any>> extends Omit<TableOptions<T>, 'data'> {
  data?: T[] | null
  onChange?: (state: TableState<T>) => void
  hasMore?: boolean
  loadMore: (pageIndex: number) => void
}

function Table<T extends Record<string, any>>({ columns, data, onChange, loadMore, hasMore }: TableProps<T>) {
  const dataRef = useRef<T[]>(data ?? [])
  const initialState = useMemo<any>(() => ({}), [])
  const defaultColumn = useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 300, // width is used for both the flex-basis and flex-grow
      // maxWidth: 500 // maxWidth is only used as a limit for resizing
    }),
    [],
  )

  const cachedData = data ?? dataRef.current
  if (data) dataRef.current = data

  const options: AllUseTableOptions<T> = {
    columns,
    data: cachedData,
    defaultColumn,
    initialState,
  }

  const instance = useTable(
    options,
    useResizeColumns,
    useBlockLayout,
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state, // : { pageIndex, pageSize, columnResizing }
  } = instance as TableInstanceWithState<T>

  useEffect(() => {
    if (!onChange) return
    onChange(state)
  }, [state, onChange])

  // Render the UI for your table
  return (
    <Box height='100%' width='100%'>
      <Flex height='100%' width='100%' {...getTableProps()} flexDirection='column' position='relative' overflowY='auto'>
        <Box flex='0 0 auto' position='sticky' top={0} bg='bw.10' backdropFilter={'blur(10px)'} borderBottom='1px solid' borderColor='bws.100'>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <Box {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Box {...column.getHeaderProps()} position='absolute' top='1px' color='bw.900' width='100%' fontWeight='600' p={2} borderBottom='1px solid' borderColor='bws.100'>
                  {column.render('Header')}
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Box {...getTableBodyProps()} height={0} minH={0} flex='1'>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={
              <Box
                bg='bw.50'
                color='bw.600'
                px={4}
                py={2}
                key={0}
                fontSize='sm'
              >
                Loading more requests...
              </Box>
            }
            useWindow={true}
          >
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                // eslint-disable-next-line react/jsx-key
                <Box {...row.getRowProps()} borderColor='bw.100'>
                  {row.cells.map(cell => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <Box {...cell.getCellProps()} p={2} color='bw.700'>
                        {cell.render('Cell')}
                      </Box>
                    )
                  })}
                </Box>
              )
            })}
          </InfiniteScroll>
        </Box>
      </Flex>
    </Box>
  )
}

export default Table
