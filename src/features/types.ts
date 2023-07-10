import { CollectionMeta } from '@polybase/client'


export interface User {
  id: string
  v: number
}

export interface CollectionMetaEx extends CollectionMeta {
  publicKey?: any
  lastRecordUpdated: string
}