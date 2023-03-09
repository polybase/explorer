import { useEffect } from 'react'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import { StudioAppCollections } from './StudioAppCollections'
import { StudioAppLayout } from './StudioAppLayout'
import { StudioAppSchema } from './StudioAppSchema'
import { StudioAppSettings } from './StudioAppSettings'
import { shortName } from '../util'

export function StudioApp() {
  const { namespace } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!namespace) {
      navigate('/')
    }
  }, [namespace, navigate])

  if (!namespace) return null

  const decodedNamespace = decodeURIComponent(namespace)

  const name = shortName(decodedNamespace)

  return (
    <StudioAppLayout name={name}>
      <Routes>
        <Route path='/' element={<StudioAppSchema namespace={decodedNamespace} />} />
        <Route path='/collections' element={<StudioAppCollections namespace={decodedNamespace} />} />
        <Route path='/collections/:collectionName' element={<StudioAppCollections namespace={decodedNamespace} />} />
        <Route path='/settings' element={<StudioAppSettings namespace={decodedNamespace} />} />
      </Routes>
    </StudioAppLayout>
  )
}