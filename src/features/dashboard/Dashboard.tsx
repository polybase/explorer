import { Box, Tabs, TabList, Tab, Container } from '@chakra-ui/react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Layout } from 'features/common/Layout'
import { DashboardDashboard } from './DashboardDashboard'
import { DashboardCollections } from './DashboardCollections'

const PATHS = ['/d', '/d/collections', '/d/settings']

export function Dashboard () {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Layout maxW='container.xl'>
      <Container maxW='container.xl' p={4} >
        <Box p={4}>
          <Tabs size='lg' onChange={(i) => {
            navigate(PATHS[i])
          }}
          index={PATHS.indexOf(location.pathname)}
          >
            <TabList>
              <Tab>DASHBOARD</Tab>
              <Tab>COLLECTIONS</Tab>
              {/* <Tab>SETTINGS</Tab> */}
            </TabList>

            <Routes>
              <Route path='/' element={<DashboardDashboard />} />
              <Route path='/collections' element={<DashboardCollections />} />
            </Routes>
          </Tabs>
        </Box>
      </Container>
    </Layout>
  )
}