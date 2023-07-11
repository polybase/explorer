import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Stack, Center, Input, Button, Box, Flex,
} from '@chakra-ui/react'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'
import { usePolybase } from '@polybase/react'
import axios from 'axios'
import { Layout } from 'features/common/Layout'
import { Panel } from 'features/common/Panel'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'
import { useCurrentUserId } from './useCurrentUserId'
import { UserError } from 'modules/common/UserError'
import { User } from 'features/types'

export function Email() {
  const db = usePolybase()
  const navigate = useNavigate()
  const [publicKey, loading] = useCurrentUserId()
  const [email, setEmail] = useState('')

  // Go to home if we're not logged in
  useEffect(() => {
    if (!publicKey && !loading) {
      navigate('/')
    }
  }, [publicKey, loading, navigate])

  const onSave = useAsyncCallback(async (e) => {
    e.preventDefault()

    // If we're not logged in, don't attempt to save
    if (!publicKey) {
      return
    }

    // Check email
    if (!email) throw new UserError('Email required')
    if (!email.includes('@')) throw new UserError('Invalid email')

    const col = db.collection<User>('polybase/apps/explorer/v2/users')

    // Create if new user in Polybase (for checking onboarding status)
    const userExists = publicKey
      ? ((await col.record(publicKey).get()).exists())
      : false

    const action = userExists
      ? col.record(publicKey).call('updateV') : col.create([])


    await action.catch((e) => {
      if (e.message.startsWith('user-cancelled-request')) {
        throw new Error('Sign message to create account')
      }
      throw e
    })

    // Save email
    await axios.post('/api/email', {
      email,
      pk: publicKey,
      source: `Explorer/${process.env.REACT_APP_ENV_NAME ?? ''}`,
    })

    // Associate email
    if (publicKey) posthog.identify(publicKey, { email })
    if (publicKey) Sentry.setUser({ id: publicKey, email })

    navigate('/studio')
  })

  return (
    <Layout>
      <Center height='100%'>
        <Box width='100%' maxW='32em' p={3} pb={14}>
          <Panel title='Enter Email'>
            <form onSubmit={onSave.execute}>
              <Stack spacing={7} mt={1}>
                <Input textTransform='lowercase' variant='filled' size='lg' p={2} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                <Flex>
                  <Button type='submit' variant='primary' isLoading={onSave.loading} size='lg' isDisabled={!publicKey}>Save Email</Button>
                </Flex>
              </Stack>
            </form>
          </Panel>
        </Box>
      </Center>
    </Layout>
  )
}