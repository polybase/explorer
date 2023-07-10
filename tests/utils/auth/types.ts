import { AuthState } from '@polybase/auth'
import { Polybase, Signer } from '@polybase/client'

export interface Auth {
  authState: AuthState
  signer: Signer
  client: Polybase
}