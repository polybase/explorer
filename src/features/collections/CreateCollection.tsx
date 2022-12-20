import { Stack, Center, Input, Button, Box } from '@chakra-ui/react'
import { Layout } from 'features/common/Layout'
import { Panel } from 'features/common/Panel'

export function CreateCollection () {
  return (
    <Layout>
      <Center height='100%'>
        <Box width='100%' maxW='32em' p={3} pb={14}>
          <Panel title='Collection Name'>
            <Stack spacing={7} mt={1}>
              <Input variant='filled' size='lg' p={2} />
              <Box>
                <Button variant='primary' size='lg'>Create Collection</Button>
              </Box>
            </Stack>
          </Panel>
        </Box>
      </Center>
    </Layout>
  )
}