import { useEffect } from 'react'
import posthog from 'posthog-js'
import { useUser } from 'features/users/useUser'

export default function PostHogUserIdentification() {
  const { publicKey } = useUser()

  useEffect(() => {
    if (publicKey) {
      posthog.identify(publicKey /* { email: user.email } */)
    } else {
      posthog.reset()
    }
  }, [publicKey])

  return null
}
