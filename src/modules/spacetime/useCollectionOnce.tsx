import { useEffect, useState } from 'react'
import { Collection, Query } from '@spacetimexyz/client'
import { UseCollectionReturnValue } from './useCollection'

export function useCollectionOnce<T=any> (collection: Collection<T>|Query<T>): UseCollectionReturnValue<T> {
  const [res, setResult] = useState<UseCollectionReturnValue<T>>({ error: null, data: null, loading: true })
  const key = collection.key()

  useEffect(() => {
    setResult({ ...res, loading: true })
    collection.get().then((data) => {
      setResult({ error: null, data,  loading: false })
    }).catch((e) => {
      setResult({ ...res, error: e, loading: false })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return res
}