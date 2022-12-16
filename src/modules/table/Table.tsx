import React, { useMemo, useEffect, useRef } from 'react'
import { css } from '@emotion/react'
import { Box } from '@chakra-ui/react'
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

export interface AllUseTableOptions<D extends Record<string, any>> extends UseTableOptions<D>, UsePaginationOptions<D> {}

export interface TableProps<T extends Record<string, any>> extends Omit<TableOptions<T>, 'data'> {
  data?: T[]|null
  onChange?: (state: TableState<T>) => void
  hasMore?: boolean
  loadMore: (pageIndex: number) => void
}

function Table <T extends Record<string, any>> ({ columns, data, onChange, loadMore, hasMore }: TableProps<T>) {
  const dataRef = useRef<T[]>(data ?? [])
  const initialState = useMemo<any>(() => ({ }), [])
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
    <Box height='100%'  width='100%' overflowY='auto'>
      <Box {...getTableProps()} css={styles.table}>
        <Box flex='0 0 auto'>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <Box {...headerGroup.getHeaderGroupProps()} className='tr' borderBottomWidth='3px' borderColor='bw.200' mb={2}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <Box {...column.getHeaderProps()} className='th' color='bw.600'>
                  {column.render('Header')}
                  {/* Use column.getResizerProps to hook up the events correctly */}
                  <Box
                    {...column.getResizerProps()}
                    className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Box {...getTableBodyProps()} height='100%'  minH={0}>
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
            useWindow={false}
          >
            {rows.map((row, i) => {
              prepareRow(row)
              return (
              // eslint-disable-next-line react/jsx-key
                <Box {...row.getRowProps()} className='tr' borderColor='bw.100'>
                  {row.cells.map(cell => {
                    return (
                    // eslint-disable-next-line react/jsx-key
                      <Box {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </Box>
                    )
                  })}
                </Box>
              )
            })}
          </InfiniteScroll>
        </Box>
      </Box>
    </Box>

  )
}

const styles = {
  table: css`
    display: flex;
    flex-direction: column;
    border-spacing: 0;
    width: 100%;
    height: 100%;
    font-size: 0.94em;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
      min-width: 100%;
    }

    .th {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.9em;
    }

    .td {
    // background: #fff;
    }

    .th,
    .td {
      margin: 0;
      min-height: 50px;
      padding: 0.5em 0.4em;
      flex: 1 0 auto;
      word-break: break-word;
      display: flex !important;
      align-items: center;

      :first-child {
        padding-left: 1em;
      }

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        background: transparent;
        width: 10px;
        height: 100%;
        position: absolute;
        right: 5px;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        touch-action:none;
        :hover {
          background: #ddd;
        }

        &.isResizing {
          background: red;
        }
      }
    }
  `,
}

export default Table
