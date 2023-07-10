import axios from 'axios'
import { Contact } from './_types'

const {
  HUBSPOT_API_KEY,
} = process.env

// create an Axios instance with default headers
const hubspotClient = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
  },
})


export async function upsertHubspotContact(contact: Contact) {
  const existingContact = await getContactByEmail(contact.email)
  if (existingContact) {
    const newPks = [...(existingContact?.properties?.pks?.split(',') ?? []), contact.pk]
    await updateContact(existingContact.id, newPks)
  } else {
    await createHubspotContact(contact)
  }
}


async function createHubspotContact(contact: Contact) {
  const { email, pk, source, tags } = contact
  const contactData = {
    properties: {
      email,
      pks: pk,
      source,
      contact_pref: tags.join(';'),
    },
  }

  await hubspotClient.post(
    '/crm/v3/objects/contacts',
    contactData,
  )
}

async function updateContact(email: string, newPks: string[]) {
  await hubspotClient.patch(
    `/crm/v3/objects/contacts/${email}`,
    {
      properties: {
        pks: newPks.join(','),
      },
    },
  )
}



async function getContactByEmail(email: string) {
  try {
    const response = await hubspotClient.get(
      `/crm/v3/objects/contacts/${email}`,
    )
    return response.data
  } catch (error) {
    return null
  }
}
