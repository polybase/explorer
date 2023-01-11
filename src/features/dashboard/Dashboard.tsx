import { Box, Container } from '@chakra-ui/react'
import { Layout } from 'features/common/Layout'
import { DashboardDashboard } from './DashboardDashboard'
import { DashboardCollections } from './DashboardCollections'
import { TabRouter } from 'features/common/TabRouter'
// '/d', '/d/collections', '/d/settings'

export function Dashboard () {
  const tabs = [{
    title: 'Dashboard',
    path: '',
    element: <DashboardDashboard />,
  }, {
    title: 'Collections',
    path: '/collections',
    element: <DashboardCollections />,
  }]

  return (
    <Layout maxW='container.xl'>
      <Container maxW='container.xl' p={4} >
        <Box p={4}>
          <TabRouter
            prefix='/d'
            tabs={tabs}
          />
        </Box>
      </Container>
    </Layout>
  )
}