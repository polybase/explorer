import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'

const schema = `
collection users {
  id: string; 

  constructor () {
    this.id =  ctx.publicKey;
  }
}
`

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? ''

async function load () {
  const db = new Polybase({
    baseURL: `${process.env.REACT_APP_API_URL}/v0`,
    signer: async (data) => {
      const privateKey = Buffer.from(PRIVATE_KEY, 'hex')
      return { h: 'eth-personal-sign', sig: ethPersonalSign(privateKey, data) }
    },
  })

  if (!PRIVATE_KEY) {
    throw new Error('No private key provided')
  }

  await db.applySchema(schema, 'polybase/apps/explorer')

  return 'Schema loaded'
}

load()
  .then(console.log)
  .catch(console.error)
