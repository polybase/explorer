import { APIRequestContext } from '@playwright/test'
import { AuthData } from './auth'

export const createCollection = async (request: APIRequestContext, authData: AuthData, name: string) => {
  await request.post('http://localhost:8080/v0/collections/Collection/records', {
    headers: {
      Authorization: `Bearer ${authData.token}`,
    },
    data: {
      args: [
        `newCollection/${name}`,
        `@public collection ${name} { id: string; name: string; constructor (name: string) { this.id = name; this.name = name; } setName(name: string) { this.name = name; } }`,
      ],
    },
  })
}