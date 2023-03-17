import {
  ChakraProvider,
} from '@chakra-ui/react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { BrowserRouter as Router } from 'react-router-dom'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import theme from './theme/theme'
import AppRoutes from './AppRoutes'
import ScrollToTop from 'modules/common/ScrollToTop'
import PostHogPageView from 'modules/common/PostHogPageView'
import { ApiProvider } from 'features/common/ApiProvider'
// import { AuthProvider } from 'features/users/AuthProvider'
import { PolybaseProvider, AuthProvider } from '@polybase/react'
import polybase from 'config/polybase'
import auth from 'config/auth'
import { UserProvider } from 'features/users/UserProvider'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY ?? '')

export const App = () => {
  return (
    <Router>
      <PolybaseProvider polybase={polybase}>
        <AuthProvider polybase={polybase} auth={auth}>
          <UserProvider
            domain={process.env.REACT_APP_DOMAIN}
            storagePrefix={process.env.REACT_APP_AUTH_STORAGE_PREFIX}
          >
            <ApiProvider baseURL={process.env.REACT_APP_API_URL}>
              <Elements stripe={stripePromise}>
                <ChakraProvider theme={theme}>
                  <PostHogPageView />
                  <ScrollToTop />
                  <AppRoutes />
                </ChakraProvider>
              </Elements>
            </ApiProvider>
          </UserProvider>
        </AuthProvider>
      </PolybaseProvider>
    </Router>
  )
}
