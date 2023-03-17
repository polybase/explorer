import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Home } from './features/home/Home'
import posthog from 'posthog-js'
import ReactGA from 'react-ga'
import { CollectionListPage } from 'features/collections/CollectionListPage'
import { CollectionsDetail } from 'features/collections/CollectionDetail'
import { Email } from 'features/users/Email'
import { Studio } from 'features/studio/Studio'
import { useIsAuthenticated } from '@polybase/react'

export default function AppRouter() {
  const [isLoggedIn, isLoggedInLoading] = useIsAuthenticated()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (process.env.REACT_APP_ENV_NAME !== 'production') {
      ReactGA.set({ page: location.pathname })
      ReactGA.pageview(location.pathname)
      posthog.capture('$pageview')
    }
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname.startsWith('/d')) return navigate('/studio')
    if (!isLoggedIn && !isLoggedInLoading && location.pathname.startsWith('/studio')) return navigate('/')
  }, [location.pathname, location.state, navigate, isLoggedIn, isLoggedInLoading])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/email' element={<Email />} />
      <Route path='/studio/*' element={<Studio />} />
      <Route path='/collections' element={<CollectionListPage />} />
      <Route path='/collections/:collectionId/*' element={<CollectionsDetail />} />
      <Route path='/*' element={<Navigate to='/' />} />
    </Routes>
  )
}
