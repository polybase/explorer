import axios from 'axios'
import { Contact } from './_types'

const {
  DISCORD_WEBHOOK_URL = '',
} = process.env

export async function sendMessageToDiscord(contact: Contact) {
  const { email, pk, source } = contact
  const messageContent = `${email} signed up from ${source} with pk ${pk}`
  await axios.post(DISCORD_WEBHOOK_URL, {
    content: messageContent,
  })
}