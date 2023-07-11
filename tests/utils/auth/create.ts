import { Auth } from './types'

const EXPLORER_NAMESPACE = 'polybase/apps/explorer/v2/users'

export async function createUser(auth: Auth) {
  return auth.client.collection(EXPLORER_NAMESPACE).create([])
}