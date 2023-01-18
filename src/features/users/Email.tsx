import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Stack, Center, Input, Button, Box, Checkbox, Heading, Text, Flex, Spacer,
} from '@chakra-ui/react'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'
import axios from 'axios'
import { Layout } from 'features/common/Layout'
import { Panel } from 'features/common/Panel'
import { useAsyncCallback } from 'modules/common/useAsyncCallback'
import { useCurrentUserId } from './useCurrentUserId'

const OPTIONS = [
  {
    title: 'Feedback',
    desc: 'Requests for feedback so we can improve the protocol',
    value: 'Feedback',
  },
  {
    title: 'Product Updates',
    desc: 'New features, improvements and bug fixes',
    value: 'Update',
  },
  {
    title: 'Essential Updates',
    desc: 'Breaking changes and deprecations',
    value: 'Essential',
  },
]

export function Email () {
  const navigate = useNavigate()
  const [publicKey] = useCurrentUserId()
  const [email, setEmail] = useState('')
  const [tags, setTags] = useState<Set<string>>(new Set(['Feedback', 'Update', 'Essential']))

  const onSave = useAsyncCallback(async (e) => {
    e.preventDefault()
    if (!email) throw new Error('Email required')
    await axios.post('https://polybase.xyz/api/email', {
      email,
      pk: publicKey,
      source: `Explorer/${process.env.REACT_APP_ENV_NAME ?? ''}`,
      tags: Array.from(tags),
    })
    if (publicKey) posthog.identify(publicKey, { email })
    if (publicKey) Sentry.setUser({ id: publicKey, email })
    navigate('/d')
  })

  return (
    <Layout>
      <Center height='100%'>
        <Box width='100%' maxW='32em' p={3} pb={14}>
          <Panel title='Enter Email'>
            <form onSubmit={onSave.execute}>
              <Stack spacing={7} mt={1}>
                <Input textTransform='lowercase' variant='filled' size='lg' p={2} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                <Box px={2}>
                  <Stack spacing={8}>
                    {OPTIONS.map(({ title, desc, value }, i) => {
                      return (
                        <Box key={title}>
                          <Checkbox
                            isChecked={tags.has(value)}
                            value={value}
                            onChange={(e) => {
                              if (!e.target.checked) tags.delete(value)
                              else tags.add(value)
                              setTags(new Set(tags))
                            }}
                            colorScheme='brand'
                            defaultChecked size='lg'
                            spacing={4}
                            alignItems='start'
                            css={{ '.chakra-checkbox__control': { marginTop: 2 } }}
                          >
                            <Stack spacing={1}>
                              <Heading as='h4' size='sm'>{title}</Heading>
                              <Text fontSize='sm'>{desc}</Text>
                            </Stack>
                          </Checkbox>
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>
                <Flex>
                  <Button type='submit' variant='primary' isLoading={onSave.loading} size='lg'>Save Email</Button>
                  <Spacer />
                  <Link to='/d'>
                    <Button type='button' color='bw.400' variant='ghost'  size='lg'>Skip</Button>
                  </Link>
                </Flex>
              </Stack>
            </form>
          </Panel>
        </Box>
      </Center>
    </Layout>
  )
}