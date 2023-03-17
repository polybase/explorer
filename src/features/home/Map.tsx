import { css } from '@emotion/react'
import { Box } from '@chakra-ui/react'
import { points } from './points'

export interface MapProps {
  highlight?: [string, string][],
}

export function Map({ highlight }: MapProps) {
  const hl = highlight?.map(([cx, cy]) => `${cx}-${cy}`)
  return (
    <Box css={styles}>
      <svg viewBox='0 0 845.2 458' css={styles}>
        {points.map(([cx, cy]) => {
          return hl && hl.indexOf(`${cx}-${cy}`) > -1 ? (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r='1.9' fill='#4BCA81' filter='url(#shadow)' />
          ) : (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r='1.9' />
          )
        })}
        <filter id='shadow' x='-100%' y='-100%' width='400%' height='400%'>
          <feDropShadow dx='0' dy='0' stdDeviation={8} floodColor='#4BCA81'></feDropShadow>
          <feDropShadow dx='0' dy='0' stdDeviation={1} floodColor='#4BCA81'></feDropShadow>
        </filter>
      </svg>
    </Box>
  )
}


const styles = css`
  .hl {
    fill: red;
  }
`