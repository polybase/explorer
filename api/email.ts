
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Cors from 'cors'
import { upsertHubspotContact } from './_hubspot'
import { sendMessageToDiscord } from './_discord'

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

export default wrapper(async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<VercelResponse> {
  const email = request.body.email as string
  const source = request.body.source as string
  const pk = request.body.pk as string
  const tags = request.body.tags as string[] ?? []

  if (!email) {
    response.statusCode = 404
    throw new Error('Email required')
  }

  const contact = {
    email,
    source,
    pk,
    tags,
  }

  // Add to both sources
  await Promise.all([
    upsertHubspotContact(contact).catch(console.error),
    sendMessageToDiscord(contact).catch(console.error),
  ])

  return response.json({
    created: true,
    email,
  })
})

export function wrapper(
  fn: (
    request: VercelRequest,
    response: VercelResponse,
  ) => Promise<VercelResponse>,
) {
  return async (
    request: VercelRequest,
    response: VercelResponse,
  ): Promise<void> => {
    try {
      // CORS
      await new Promise((resolve, reject) => {
        cors(request, response, (result: any) => {
          if (result instanceof Error) {
            return reject(result)
          }
          return resolve(result)
        })
      })
      await fn(request, response)
    } catch (e: any) {
      if (!response.statusCode || e?.message) response.statusCode = 500
      response.json({
        error: {
          message: e?.message ?? 'Unexpected error',
        },
      })
    }
  }
}
