import { useState } from 'react'
import { Stack, Center, Input, Button, Box, FormControl, FormHelperText, FormErrorMessage } from '@chakra-ui/react'
import { Layout } from 'features/common/Layout'
import { Panel } from 'features/common/Panel'
import { usePolybase } from '@polybase/react'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'

export function CreateCollection () {
  const db = usePolybase()
  const [name, setName] = useState('')

  const createCollection = useAsyncCallback(async (e) => {
    e.preventDefault()
    const path = name.split('/')
    await db.applySchema(`
      // This is a default collection deployed using the explorer.
      // You should edit these collection rules for your use case.
      
      // The language is very similar to JavaScript, but keep in
      // mind that semi-colons are mandatory!

      collection ${path[path.length-1]} {
        // id is required on all collections
        id: string;

        // Add a public key of the owner
        // of the record, we can then use this 
        // public key to implement permissions
        publicKey: string;

        // An optional property denoted with ?
        name?: string; 

        // Constructor is called when a new record is
        // created, make sure to assign a value to this.id
        constructor (id: string) {
          // Allow the user to prov
          this.id = id;
          this.publicKey = ctx.publicKey;
        }


        // You can add your own functions to determine rules
        // on who can update the records data
        function setName (name: string) {
          if (ctx.publicKey != this.public) {
            error('You are not the owner');
          }
          this.name = name;
        }
      }
    `, path.slice(0, -1).join('/'))
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