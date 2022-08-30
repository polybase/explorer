import * as React from 'react'
import {
  ChakraProvider,
} from '@chakra-ui/react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
// import { ModalProvider } from '@1productaweek/react-modal-hooks'
import { Global } from '@emotion/react'
import globalStyles from './globalStyles'
import { BrowserRouter as Router } from 'react-router-dom'
import theme from './theme'
import AppRoutes from './AppRoutes'
import ScrollToTop from 'modules/common/ScrollToTop'
import PostHogPageView from 'modules/common/PostHogPageView'
import { ApiProvider } from 'features/common/ApiProvider'
import { AuthProvider } from 'features/users/AuthProvider'
import { Web3Provider } from 'features/web3/Web3Provider'
import { SpacetimeProvider } from '@spacetimexyz/react'
import spacetime from 'config/spacetime'
import web3 from 'config/web3'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY ?? '')

export const App = () => {
  return (
    <Web3Provider web3={web3}>
      <SpacetimeProvider spacetime={spacetime}>
        <AuthProvider
          domain={process.env.REACT_APP_DOMAIN}
          storagePrefix={process.env.REACT_APP_AUTH_STORAGE_PREFIX}
        >
          <ApiProvider baseURL={process.env.REACT_APP_API_URL}>
            <Elements stripe={stripePromise}>
              <ChakraProvider theme={theme}>
                <Global styles={[globalStyles]} />
                <Router>
                  <PostHogPageView />
                  <ScrollToTop />
                  <AppRoutes />
                </Router>
              </ChakraProvider>
            </Elements>
          </ApiProvider>
        </AuthProvider>
      </SpacetimeProvider>
    </Web3Provider>
  )
}
