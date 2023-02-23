import { Client } from '@notionhq/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Cors from 'cors'

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
  const databaseId = process.env.NOTION_EMAILS_DB_ID ?? ''
  const notion = new Client({ auth: process.env.NOTION_TOKEN })

  if (!email) {
    response.statusCode = 404
    throw new Error('Email required')
  }

  const { results } = await notion.databases.query({
    database_id: databaseId,
    filter: {
      type: 'title',
      property: 'Email',
      title: {
        equals: email,
      },
    },
  })

  // Skip adding if already present
  if (results.length) {
    return response.json({
      created: false,
      email,
    })
  }

  await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: {
      Email: {
        title: [
          {
            text: {
              content: email,
            },
          },
        ],
      },
      Source: {
        select: {
          name: source ?? 'Default',
        },
      },
      Tags: {
        multi_select: Array.isArray(tags) ? tags.map((name) => ({ name })) : [],
      },
      Pk: {
        rich_text: [{
          text: {
            content: pk ?? '',
          },
        }],
      },
    },
  })


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