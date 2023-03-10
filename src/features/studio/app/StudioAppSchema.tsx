import { useCallback, useEffect, useState } from 'react'
import { Flex, Box, useColorMode, Container, Text, Heading, Spacer, Button, Stack } from '@chakra-ui/react'
import CodeMirror from '@uiw/react-codemirror'
import { ViewUpdate } from '@codemirror/view'
import { usePolybase } from '@polybase/react'
import { githubLight } from '@uiw/codemirror-theme-github'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { javascript } from '@polybase/codemirror-lang-javascript'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'
import { useUserCollections } from '../useUserCollections'
import { getCollections, isSchemaMismatch } from '../util'

export interface StudioAppSchemaProps {
  namespace: string
}

export function StudioAppSchema({ namespace }: StudioAppSchemaProps) {
  // const [code, setCode] = useState('')
  const [editedValue, setEditedValue] = useState<string | null>(null)
  const [skipSchemaMismatch, setSkipSchemaMismatch] = useState<boolean | null>(null)
  const polybase = usePolybase()
  const { data, loading } = useUserCollections()
  const collections = getCollections(namespace, data?.data)


  // Read only if not owner of collection, or collection being saved
  const meta = collections[0]
  const code = meta?.data?.code

  useEffect(() => {
    if (editedValue === null && code) {
      setEditedValue(code)
    }
  }, [code, editedValue])

  // Schema mismatch
  const mismatch = isSchemaMismatch(collections)

  useEffect(() => {
    if (loading || !code || skipSchemaMismatch !== null) return
    setSkipSchemaMismatch(!mismatch)
  }, [mismatch, loading, code, skipSchemaMismatch])

  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    setEditedValue(value)
  }, [])
  const colorMode = useColorMode()

  const onSave = useAsyncCallback(async () => {
    if (!editedValue) return
    await polybase.applySchema(editedValue, namespace)
  })

  const hasChanges = (editedValue && editedValue !== code)

  if (mismatch && skipSchemaMismatch === false) {
    return (
      <Container maxW='container.lg'>
        <Stack py={8} spacing={8} maxW='40em'>
          <Heading as='h1'>Schema Mismatch</Heading>
          <Stack spacing={4}>
            <Heading as='h2' fontSize='2xl'>Import & Merge</Heading>
            <Text>
              It looks like you've made changes to your schema outside of the studio editor. Studio will merge
              your schema into a single definition, but you should check to ensure each collection definition is still valid.
            </Text>
            <Box>
              <Button onClick={() => {
                setEditedValue(collections.map((c) => c.data.code).join('\n\n'))
                setSkipSchemaMismatch(true)
              }} size='lg' colorScheme='purple'>Merge</Button>
            </Box>
          </Stack>
        </Stack>
      </Container>
    )
  }

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
          value={editedValue ?? ''}
          height='100%'
          extensions={[javascript({ typescript: true })]}
          onChange={onChange}
        />
      </Box>
    </Flex>
  )
}

