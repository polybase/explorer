import { useCallback, useState } from 'react'
import { Box, Button } from '@chakra-ui/react'
import CodeMirror from '@uiw/react-codemirror'
import { ViewUpdate } from '@codemirror/view'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { javascript } from '@polybase/codemirror-lang-javascript'
import { usePolybase, useRecord } from '@polybase/react'
import { CollectionMetaEx } from '../types'
import { Loading } from 'modules/loading/Loading'
import { useCurrentUserId } from 'features/users/useCurrentUserId'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'

export interface CollectionDetailSchemaProps {
  collectionId: string
}

export function CollectionDetailSchema ({ collectionId }: CollectionDetailSchemaProps) {
  const polybase = usePolybase()
  const [publicKey] = useCurrentUserId()
  const [editedValue, setEditedValue] = useState('')

  const { data: meta, loading: loadingMeta, error: metaError } = useRecord<CollectionMetaEx>(
    collectionId ? polybase.collection('Collection').record(collectionId) : null,
  )

  // Read only if not owner of collection, or collection being saved
  const code = meta?.data?.code
  const namespace = meta?.data.id.split('/').slice(0, -1).join('/')

  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    setEditedValue(value)
  }, [])

  const onSave = useAsyncCallback(async () => {
    await polybase.applySchema(editedValue, namespace)
  })

  const isReadOnly = meta?.data.publicKey !== publicKey || onSave.loading
  const hasChanges = editedValue && editedValue !== code

  return (
    <Loading loading={loadingMeta} height='100%'>
      <Box height='100%' flex='1 1 auto' position='relative'>
        <Box position='absolute' top={3} left={0} right={0} bottom={0}>
          <Box position='absolute' right={2} top={2} zIndex={1000}>
            <Button
              isDisabled={isReadOnly || !hasChanges}
              onClick={onSave.execute}
              isLoading={onSave.loading}
              colorScheme={hasChanges ? 'blue' : undefined}
            >
              {isReadOnly ? 'READ ONLY' : 'SAVE'}
            </Button>
          </Box>
          <CodeMirror
            theme={vscodeDark}
            readOnly={meta?.data.publicKey !== publicKey}
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
            onChange={onChange}
          />
        </Box>
      </Box>
    </Loading>
  )
}