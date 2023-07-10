import { Polybase } from '@polybase/client'
import { ethPersonalSign } from '@polybase/eth'

const schema = `
@public
collection users {
  id: string; 
  v?: number;

  constructor () {
    this.id = ctx.publicKey.toHex();
    this.v = 1;
  }

  function updateV () {
    this.v = 1;
  }
}
`

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? ''

async function load() {
  const db = new Polybase({
    baseURL: `${process.env.REACT_APP_API_URL}/v0`,
    signer: async (data) => {
      let key = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY.slice(2) : PRIVATE_KEY
      const privateKey = Buffer.from(key, 'hex')
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
