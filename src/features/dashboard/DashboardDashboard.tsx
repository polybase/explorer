import { Box, Grid, GridItem, Stack, Button, Center } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Panel } from 'features/common/Panel'
import { CollectionPanel } from 'features/collections/CollectionPanel'
import { useCurrentUserId } from 'features/users/useCurrentUserId'

export function DashboardDashboard () {
  const [publicKey] = useCurrentUserId()
  const spacing = 6
  return (
    <Box p={4} py={spacing}>
      <Grid
        templateRows='repeat(1, 1fr)'
        templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
        gap={[spacing]}
      >
        <GridItem colSpan={[1]}>
          <Stack spacing={spacing}>
            <Panel title='Get Started'>
              <Box>
                <Link to='/collections/create'>
                  <Button width='100%' variant='primary' size='lg' py={6}>Create a collection</Button>
                </Link>
              </Box>
            </Panel>
            <CollectionPanel pk={publicKey} />
          </Stack>
        </GridItem>
        <GridItem colSpan={[1, 2]}>
          <Panel title='Usage'>
            <Center height='140px'>
              <Box fontWeight='semibold'>METRICS WILL APPEAR HERE SHORTLY</Box>
            </Center>
          </Panel>
        </GridItem>
      </Grid>
    </Box>
  )
}