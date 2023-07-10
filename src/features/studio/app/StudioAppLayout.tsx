import React, { useState, useEffect } from 'react'
import { Flex, Box, IconButton, Stack } from '@chakra-ui/react'
import { FaCode, FaCog, FaDatabase } from 'react-icons/fa'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useUserCollections } from '../useUserCollections'
import { StudioLayout } from '../StudioLayout'
import { shortName, getCollections } from '../util'

const NAV = [
  {
    to: '',
    label: 'Schema',
    icon: <FaCode />,
    exact: true,
  }, {
    to: '/collections',
    label: 'Collections',
    icon: <FaDatabase />,
    exact: false,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: <FaCog />,
    exact: true,
  },
]

export interface StudioAppLayoutProps {
  children: React.ReactNode
  name?: string
}

export function StudioAppLayout({ children, name }: StudioAppLayoutProps) {
  const location = useLocation()
  const { namespace } = useParams()
  const [lastCollectionId, setLastCollectionId] = useState<string | null>(null)
  const { data } = useUserCollections()

  useEffect(() => {
    if (!namespace) return
    const collections = getCollections(namespace, data?.data)
    const collectionId = collections[0] && shortName(collections[0].data.id)

    // Set the first collection as default
    if (collectionId && !lastCollectionId) {
      setLastCollectionId(collectionId)
    }

    // Save last collection location
    if (location.pathname.startsWith(`/studio/${encodeURIComponent(namespace)}/collections`)) {
      setLastCollectionId(shortName(location.pathname))
    }
  }, [data?.data, lastCollectionId, location.pathname, namespace])

  return (
    <StudioLayout name={name}>
      <Flex height='100%' minH={0}>
        <Stack borderRight='1px solid' borderColor='bw.100' height='100%' p={2} py={3} spacing={3} flex='0 0 60px' width='60px'>
          {NAV.map(({ to, label, icon, exact }) => {
            let url = `/studio/${encodeURIComponent(namespace ?? '')}${to}`
            const match = exact ? location.pathname === url : location.pathname.startsWith(url)
            if (to === '/collections' && lastCollectionId) {
              url = url + '/' + lastCollectionId
            }
            return (
              <IconButton
                key={label}
                colorScheme={match ? 'purple' : 'gray'}
                aria-label={label}
                size='lg'
                icon={icon}
                opacity={match ? 1 : 0.7}
                to={url}
                as={Link}
              />
            )
          })}
        </Stack>
        <Box height='100%' width='100%' flex='1 1 auto' minW='0'>
          {children}
        </Box>
      </Flex>
    </StudioLayout>
  )
}