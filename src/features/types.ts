import { CollectionMeta } from '@polybase/client'


export interface User {
  id: string
  email: string
  enkey: string
}

export interface CollectionMetaEx extends CollectionMeta {
  publicKey?: any
  lastRecordUpdated: string
}