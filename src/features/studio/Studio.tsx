import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { usePolybase } from '@polybase/react'
import { StudioAppList } from './StudioAppList'
import { StudioApp } from './app/StudioApp'
import { CreateApp } from './app/CreateApp'
import { useUser } from 'features/users/useUser'

export function Studio() {
  const db = usePolybase()
  const user = useUser()
  const navigate = useNavigate()
  const pk = user?.publicKey

  useEffect(() => {
    if (!pk) return

    (async () => {
      const col = db.collection('polybase/apps/explorer/users')
      const userExists: boolean = await col
        .record(pk)
        .get()
        .then((user) => {
          return user.data?.v === 1
        })

      if (!userExists) {
        navigate('/email')
      }
    })()
  }, [db, navigate, pk])

  return (
    <Routes>
      <Route path='/' element={<StudioAppList />} />
      <Route path='/create' element={<CreateApp />} />
      <Route path='/:namespace/*' element={<StudioApp />} />
    </Routes>
  )
}