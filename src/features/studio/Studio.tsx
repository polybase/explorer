import { Routes, Route } from 'react-router-dom'
import { StudioAppList } from './StudioAppList'
import { StudioApp } from './app/StudioApp'
import { CreateApp } from './app/CreateApp'

export function Studio() {


  return (
    <Routes>
      <Route path='/' element={<StudioAppList />} />
      <Route path='/create' element={<CreateApp />} />
      <Route path='/:namespace/*' element={<StudioApp />} />
    </Routes>
  )
}