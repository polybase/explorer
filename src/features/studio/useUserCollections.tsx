import { usePolybase, useCollection } from '@polybase/react'
import { CollectionMeta } from '@polybase/client'
import { useCurrentUserId } from 'features/users/useCurrentUserId'

export function useUserCollections() {
  const [publicKey] = useCurrentUserId()
  const polybase = usePolybase()

  const query = polybase.collection('Collection')

  return useCollection<CollectionMeta>(
    publicKey
      ? query.where('publicKey', '==', publicKey) : null,
  )
}