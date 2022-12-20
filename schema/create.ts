import { secp256k1, encodeToString  } from '@polybase/util'

async function create () {
  const privateKey= await secp256k1.generatePrivateKey()
  const publicKey = await secp256k1.getPublicKey(privateKey)
  console.log(`
    Add these keys to your env variables:
      PUBLIC_KEY=${encodeToString(publicKey, 'hex')}
      PRIVATE_KEY=${encodeToString(privateKey, 'hex')}
  `)
}

create()
  .then(console.log)
  .catch(console.error)
