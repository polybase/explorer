import React from 'react'
import { css } from '@emotion/react'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { Box } from '@chakra-ui/react'

export interface ResizeableTitleProps {
  onResize: (e: React.SyntheticEvent, data: ResizeCallbackData) => any
  width: number
}

function ResizeableTitle ({ onResize, width, ...restProps }: ResizeableTitleProps) {
  if (!width) {
    return <th {...restProps} />
  }

  return (
    <Box css={styles.resizer}>
      <Resizable
        width={width}
        height={0}
        handle={
          <span
            className='react-resizable-handle'
            onClick={e => {
              e.stopPropagation()
            }}
          />
        }
        onResize={onResize}
        draggableOpts={{ enableUserSelectHack: false }}
      >
        <th {...restProps} />
      </Resizable>
    </Box>
  )
}

const styles = {
  resizer: css`
    position: relative;
    background-clip: padding-box;

    .react-resizable-handle {
      position: absolute;
      width: 10px;
      height: 100%;
      bottom: 0;
      right: -5px;
      cursor: col-resize;
      z-index: 1;
    }
  `,
}

export default ResizeableTitle
