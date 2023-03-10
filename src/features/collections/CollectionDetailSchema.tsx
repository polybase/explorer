import { Box } from '@chakra-ui/react'
import CodeMirror from '@uiw/react-codemirror'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { javascript } from '@polybase/codemirror-lang-javascript'
import { usePolybase, useRecord } from '@polybase/react'
import { CollectionMetaEx } from '../types'
import { Loading } from 'modules/loading/Loading'

export interface CollectionDetailSchemaProps {
  collectionId: string
}

export function CollectionDetailSchema({ collectionId }: CollectionDetailSchemaProps) {
  const polybase = usePolybase()

  const { data: meta, loading: loadingMeta, error: metaError } = useRecord<CollectionMetaEx>(
    collectionId ? polybase.collection('Collection').record(collectionId) : null,
  )

  // Read only if not owner of collection, or collection being saved
  const code = meta?.data?.code

  return (
    <Loading loading={loadingMeta} height='100%'>
      <Box height='100%' flex='1 1 auto' position='relative'>
        <Box position='absolute' top={3} left={0} right={0} bottom={0}>

          <CodeMirror
            theme={vscodeDark}
            readOnly
            style={{
              borderRadius: 5,
              // color: '#333',
              flex: '1 1 auto',
              height: '100%',
              overflow: 'auto',
            }}
            value={code}
            height='auto'
            extensions={[javascript({ typescript: true })]}
          />
        </Box>
      </Box>
    </Loading>
  )
}

// function toPublicKeyHex(x?: string, y?: string) {
//   if (!x || !y) return
//   const xb = decodeFromString(x.replace(/_/g, '/').replace(/-/g, '+'), 'base64')
//   const yb = decodeFromString(y.replace(/_/g, '/').replace(/-/g, '+'), 'base64')
//   const key = new Uint8Array(64)
//   key.set(xb, 0)
//   key.set(yb, 32)
//   return encodeToString(key, 'hex')
// }