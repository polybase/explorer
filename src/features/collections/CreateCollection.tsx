import { useState } from 'react'
import { Stack, Center, Input, Button, Box, FormControl, FormHelperText, FormErrorMessage } from '@chakra-ui/react'
import { Layout } from 'features/common/Layout'
import { Panel } from 'features/common/Panel'
import { usePolybase } from '@polybase/react'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_CODE } from './default-code'

export function CreateCollection() {
  const db = usePolybase()
  const [name, setName] = useState('')

  const navigate = useNavigate()

  const createCollection = useAsyncCallback(async (e) => {
    e.preventDefault()
    const path = name.split('/')
    await db.applySchema(DEFAULT_CODE(path[path.length - 1]), path.slice(0, -1).join('/'))
    navigate(`/collections/${encodeURIComponent(name)}/schema`)
  })

  const isError = !!(name && name.split('/').length === 1
  )
  return (
    <Layout>
      <Center height='100%'>
        <Box width='100%' maxW='32em' p={3} pb={14}>
          <Panel title='Collection Path'>
            <form onSubmit={createCollection.execute}>
              <Stack spacing={7} mt={1}>
                <FormControl isInvalid={isError}>
                  <Input variant='filled' size='lg' p={2} onChange={(e) => setName(e.target.value)} />
                  {!isError ? (
                    <FormHelperText>E.g. namespace/collection_name</FormHelperText>
                  ) : (
                    <FormErrorMessage>Namespace is required, add using / seperator</FormErrorMessage>
                  )}
                </FormControl>
                <Box>
                  <Button
                    type='submit'
                    isLoading={createCollection.loading}
                    variant='primary'
                    size='lg'
                  >
                    Create Collection
                  </Button>
                </Box>
              </Stack>
            </form>
          </Panel>
        </Box>
      </Center>
    </Layout>
  )
}