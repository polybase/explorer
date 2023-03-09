import { useCallback, useState } from 'react'
import { Flex, Box, useColorMode, Heading, Spacer, Button } from '@chakra-ui/react'
import CodeMirror from '@uiw/react-codemirror'
import { ViewUpdate } from '@codemirror/view'
import { usePolybase } from '@polybase/react'
import { githubLight } from '@uiw/codemirror-theme-github'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { javascript } from '@polybase/codemirror-lang-javascript'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'
import { useUserCollections } from '../useUserCollections'
import { getCollections } from '../util'

export interface StudioAppSchemaProps {
  namespace: string
}

export function StudioAppSchema({ namespace }: StudioAppSchemaProps) {
  const polybase = usePolybase()
  const { data } = useUserCollections()
  const collections = getCollections(namespace, data?.data)

  // Read only if not owner of collection, or collection being saved
  const meta = collections[0]
  const code = meta?.data?.code

  // TODO: handle situation where we have individual schemas for each collection

  const [editedValue, setEditedValue] = useState('')
  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    setEditedValue(value)
  }, [])
  const colorMode = useColorMode()

  const onSave = useAsyncCallback(async () => {
    await polybase.applySchema(editedValue, namespace)
  })

  const hasChanges = editedValue && editedValue !== code

  return (
    <Flex flexDirection='column' height='100%'>
      <Flex borderBottom='1px solid' borderColor='bw.100' alignItems='center'>
        <Heading size='md' p={4}>
          Schema
        </Heading>
        <Spacer />
        <Box px={4}>
          <Button
            onClick={onSave.execute}
            isLoading={onSave.loading}
            colorScheme={hasChanges ? 'purple' : undefined}
            isDisabled={!hasChanges}
          >
            Save
          </Button>
        </Box>
      </Flex>
      <Box height='100%' flex='1 1 auto' minH='0px' css={{ '.cm-gutters': { border: 0 } }}>
        <CodeMirror
          theme={colorMode.colorMode === 'dark' ? vscodeDark : githubLight}
          style={{
            flex: '1 1 auto',
            height: '100%',
            width: '100%',
            overflow: 'auto',
          }}
          value={code}
          height='100%'
          extensions={[javascript({ typescript: true })]}
          onChange={onChange}
        />
      </Box>
    </Flex>
  )
}

