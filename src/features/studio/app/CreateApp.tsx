import { useState } from 'react'
import { Stack, Center, Input, Button, Box, FormControl, FormHelperText, FormErrorMessage } from '@chakra-ui/react'
import { Panel } from 'features/common/Panel'
import { usePolybase } from '@polybase/react'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_CODE } from './default-code'
import { useCurrentUserId } from 'features/users/useCurrentUserId'
import { StudioLayout } from '../StudioLayout'

export function CreateApp() {
  const db = usePolybase()
  const [publicKey] = useCurrentUserId()
  const [name, setName] = useState('')

  const navigate = useNavigate()

  const createCollection = useAsyncCallback(async (e) => {
    e.preventDefault()
    const format = name.startsWith('/') ? name.slice(1) : name
    const namespace = `pk/${publicKey}/${format}`

    await db.applySchema(DEFAULT_CODE(), namespace)
    navigate(`/studio/${encodeURIComponent(namespace)}`)
  })

  const hasSpaces = !!(name && name.includes(' '))
  const hasSlash = !!(name && name.includes('/'))
  const isError = hasSpaces || hasSlash

  return (
    <StudioLayout>
      <Center height='100%'>
        <Box width='100%' maxW='32em' p={3} pb={14}>
          <Panel title='Name your app'>
            <form onSubmit={createCollection.execute}>
              <Stack spacing={7} mt={1}>
                <FormControl isInvalid={isError}>
                  <Input variant='filled' size='lg' p={2} onChange={(e) => setName(e.target.value)} />
                  {!isError ? (
                    null
                  ) : (
                    <>
                      {hasSpaces && (<FormErrorMessage>Spaces are not allowed</FormErrorMessage>)}
                      {hasSlash && (<FormErrorMessage>Slash `/` is not allowed</FormErrorMessage>)}
                    </>
                  )}
                </FormControl>
                <Box>
                  <Button
                    type='submit'
                    isLoading={createCollection.loading}
                    variant='primary'
                    size='lg'
                    disabled={isError}
                  >
                    Create App
                  </Button>
                </Box>
              </Stack>
            </form>
          </Panel>
        </Box>
      </Center>
    </StudioLayout>
  )
}