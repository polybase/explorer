import * as eth from '@polybase/eth'
import { usePolybase } from '@polybase/react'
import { extractPublicKey } from '@metamask/eth-sig-util'
import { Polybase } from '@polybase/client'
import { sign } from '@polybase/eth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { User } from 'features/types'

export function useLogin () {
  const { login } = useAuth()
  const db = usePolybase()
  const navigate = useNavigate()

  return async () => {
    const accounts = await eth.requestAccounts()
    const account = accounts[0]
    const [publicKey, newUser] = await getWallet(account, db)

    // Login
    login(publicKey)

    // Go to dashboard
    navigate(newUser ? '/email' : '/d')
  }
}

async function getWallet (account: string, db: Polybase): Promise<[string, boolean]> {
  // Lookup account
  const col = db.collection<User>('polybase/apps/explorer/users')

  // Get public key
  const pk = await getPublicKey(account)

  const doc = col.record(pk)
  const user = await doc.get().catch(() => null)

  db.signer(async (data: string) => {
    return {  h: 'eth-personal-sign', sig: await sign(data, account) }
  })

  if (!user) {
    await col.create([]).catch((e) => {
      console.error(e)
      throw e
    })
  }

  return [pk, !user]
}

export async function getPublicKey (account: string) {
  const msg = 'Login to Polybase Explorer'
  const sig = await sign(msg, account)
  const publicKey = await extractPublicKey({ data: msg, signature: sig })
  return publicKey
}
