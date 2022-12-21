import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Home } from './features/home/Home'
import posthog from 'posthog-js'
import ReactGA from 'react-ga'
import { CollectionsList } from 'features/collections/CollectionList'
import { CollectionsDetail } from 'features/collections/CollectionDetail'
import { RecordDetail } from 'features/collections/RecordDetail'
import { Email } from 'features/users/Email'
import { Dashboard } from 'features/dashboard/Dashboard'
import { CreateCollection } from 'features/collections/CreateCollection'
import { useIsLoggedIn } from 'features/users/useIsLoggedIn'

export default function AppRouter () {
  const [isLoggedIn, isLoggedInLoading] = useIsLoggedIn()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
    posthog.capture('$pageview')
  }, [location.pathname])

  useEffect(() => {
    if (!isLoggedIn && !isLoggedInLoading && location.pathname.startsWith('/d')) return navigate('/')
  }, [location.pathname, location.state, navigate, isLoggedIn, isLoggedInLoading])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/email' element={<Email />} />
      <Route path='/d/*' element={<Dashboard />} />
      <Route path='/collections' element={<CollectionsList />} />
      <Route path='/collections/create' element={<CreateCollection />} />
      <Route path='/collections/:collectionId' element={<CollectionsDetail />} />
      <Route path='/collections/:collectionId/:recordId' element={<RecordDetail />} />
      <Route path='/*' element={<Navigate to='/' />} />
    </Routes>
  )
}
