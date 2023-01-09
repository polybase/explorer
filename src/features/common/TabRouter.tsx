import { Tabs, TabList, Tab } from '@chakra-ui/react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

export interface TabPath {
  title: string
  path: string
  element: React.ReactElement
}

export interface TabRouterProps {
  prefix?: string
  tabs: TabPath[]
}

export function TabRouter ({ tabs, prefix }: TabRouterProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const paths = tabs.map(({ path }) => prefix ? `${prefix}${path}` : path)

  return (
    <Tabs size='lg'
      onChange={(i) => {
        const t = tabs[i]
        navigate(prefix ? `${prefix}${t.path}` : t.path)
      }}
      index={paths.indexOf(location.pathname)}
    >
      <TabList>
        {tabs.map(({ path, title }) => (
          <Tab key={path}>{title}</Tab>
        ))}
      </TabList>
      <Routes>
        {tabs.map(({ path, element }) => {
          return (
            <Route
              key={path}
              path={path}
              element={element}
            />
          )
        })}
      </Routes>
    </Tabs>
  )
}