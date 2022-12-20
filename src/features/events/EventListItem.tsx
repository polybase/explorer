import React from 'react'
import { Avatar, Text, HStack, Stack, Heading } from '@chakra-ui/react'
import { Event } from './types'

export interface EventListItemProps {
  event: Event
}

export function EventListItem ({ event }: EventListItemProps) {
  switch (event.event) {
    case 'NewBlock':
      return <EventItemBase name='Block' subtext={`#${event.data?.value?.block.header?.height}`} />
    case 'Polka':
    case 'Lock':
    case 'NewRoundStep':
    case 'ValidBlock':
    case 'NewRound':
    case 'CompleteProposal':
      return <EventItemBase name={event.event} subtext={`#${event.data?.value?.height}`} />
    case 'Vote':
      return <EventItemBase name={event.event} subtext={`#${event.data?.value?.Vote?.height}`} />
    case 'NewBlockHeader':
      return <EventItemBase name={event.event} subtext={`#${event.data.value.header.height}`} />
  }
  return (
    <EventItemBase name={event.event} />
  )
}

export interface EventItemBaseProps {
  name: string
  subtext?: string
}

export function EventItemBase ({ name, subtext }: EventItemBaseProps) {
  return (
    <HStack>
      <Avatar bg='bw.100' color='bw.700' name={name} />
      <Stack spacing={1}>
        <Heading size='xs'>{name}</Heading>
        <Text fontSize='xs'>{subtext}</Text>
      </Stack>
    </HStack>
  )
}