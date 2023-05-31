import { useAsyncCallback as useAsyncCallbackBase, UseAsyncCallbackOptions } from 'react-async-hook'
import { useToast } from '@chakra-ui/react'
import * as Sentry from '@sentry/react'
import { UserError } from './UserError'
import { PolybaseError } from '@polybase/client'
import { AxiosError } from 'axios'

export type ExtendedOptions<R> = UseAsyncCallbackOptions<R> & {
  logError?: boolean
  errorTitle?: string
  successTitle?: string
}

export function useAsyncCallback<R = unknown, Args extends any[] = any[]>(asyncFunction: (...args: Args) => Promise<R> | R, options?: ExtendedOptions<R>) {
  const { onError, errorTitle, logError, successTitle, ...baseOptions } = options || {}
  const toast = useToast()
  return useAsyncCallbackBase(async (...params: Args) => {
    const res = await asyncFunction(...params)
    if (successTitle) {
      toast({
        status: 'success',
        title: successTitle,
      })
    }
    return res
  }, {
    ...baseOptions,
    onError: (e, options) => {
      if (onError) onError(e, options)

      toast({
        status: 'error',
        title: errorTitle,
        description: e?.message,
        isClosable: true,
        duration: 9000,
      })

      if (logError !== false && !(e instanceof UserError)) {
        let ctx = {}

        // Don't log Axios errors with no response
        if (e instanceof AxiosError && !e.response) {
          return
        }

        // Add context for Polybase errors
        if (e instanceof PolybaseError) {
          ctx = {
            ...ctx,
            polybase: {
              code: e.code,
              reason: e.reason,
              message: e.message,
              data: e.data,
              originalError: e.originalError,
            },
          }
        }

        Sentry.captureException(e, ctx)
      }
    },
  })
}
