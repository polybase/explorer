import { useCallback } from 'react'
import { Box, Button } from '@chakra-ui/react'
import CodeMirror from '@uiw/react-codemirror'
import { ViewUpdate } from '@codemirror/view'
import { atomone } from '@uiw/codemirror-theme-atomone'
import { javascript } from '@polybase/codemirror-lang-javascript'
import { usePolybase, useRecord } from '@polybase/react'
import { CollectionMetaEx } from '../types'
import { Loading } from 'modules/loading/Loading'
import { useCurrentUserId } from 'features/users/useCurrentUserId'

export interface CollectionDetailSchemaProps {
  collectionId: string
}

export function CollectionDetailSchema ({ collectionId }: CollectionDetailSchemaProps) {
  const polybase = usePolybase()
  const [publicKey] = useCurrentUserId()

  const { data: meta, loading: loadingMeta, error: metaError } = useRecord<CollectionMetaEx>(
    collectionId ? polybase.collection('Collection').record(collectionId) : null,
  )

  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    console.log('value:', value)
  }, [])

  return (
    <Loading loading={loadingMeta} height='100%'>
      <Box height='100%' flex='1 1 auto' position='relative'>
        <Box position='absolute' top={3} left={0} right={0} bottom={0}>
          <Box position='absolute' right={2} top={2} zIndex={1000}>
            <Button>
              READ ONLY
            </Button>
          </Box>
          <CodeMirror
            theme={atomone}
            readOnly={meta?.data.publicKey !== publicKey}
            style={{
              borderRadius: 5,
              // color: '#333',
              flex: '1 1 auto',
              height: '100%',
              overflow: 'auto',
            }}
            value={meta?.data?.code}
            height='auto'
            extensions={[javascript({ typescript: true })]}
            onChange={onChange}
          />
        </Box>
      </Box>
    </Loading>
  )
}