const code = 'https://auth.testnet.polybase.xyz/api/email/code'
const codeBody = {
  data: {
    email: 'polybase2@mailto.plus',
  },
}

const verify = 'https://auth.testnet.polybase.xyz/api/email/verify'

export const auth = { code, codeBody, verify }