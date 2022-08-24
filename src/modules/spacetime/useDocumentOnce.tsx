import { useEffect, useState } from 'react'
import { Doc } from '@spacetimexyz/client'
import { UseDocumentReturnValue } from './useDocument'

export function useDocumentOnce<T=any> (doc: Doc<T>): UseDocumentReturnValue<T> {
  const [res, setResult] = useState<UseDocumentReturnValue<T>>({ error: null, data: null, loading: true })
  const key = doc.key()

  useEffect(() => {
    setResult({ ...res, loading: true })
    doc.get().then((data) => {
      setResult({ error: null, data,  loading: false })
    }).catch((e) => {
      setResult({ ...res, error: e, loading: false })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return res
}