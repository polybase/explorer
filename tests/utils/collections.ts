import { Auth } from './auth'

export const createCollection = async (auth: Auth, fullName: string) => {
  const parts = fullName.split('/')
  const collection = parts.pop()

  const schema = `@public collection ${collection} { id: string; name: string; constructor (name: string) { this.id = name; this.name = name; } setName(name: string) { this.name = name; } }`
  await auth.client.applySchema(schema, parts.join('/'))
}