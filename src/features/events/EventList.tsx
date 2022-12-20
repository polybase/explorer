import { useState } from 'react'
// import { Box } from '@chakra-ui/react'
import useInterval from 'use-interval'
import { useApi } from 'features/common/useApi'
import { List } from 'features/common/List'
import { Event, EventType } from './types'
import { EventListItem } from './EventListItem'

export interface EventListProps {
  count?: number
  event?: EventType
}

export function EventList ({ count, event }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([])
  const api = useApi()
  useInterval(async () => {
    // /v0/events?filter={%22query%22:%22tm.event%20=%20%27NewBlock%27%22}
    const params = event
      ? {
        filter: JSON.stringify({
          query: `tm.event='${event}'`,
        }),
      }
      : {}
    const res = await api.get('/v0/events', { params })
    const events = res.data.items as Event[]
    if (events && Array.isArray(events)) {
      setEvents(events.slice(0, count ?? 10))
    }
  }, 500, true)

  return (
    <List>
      {events.map((event, i) => {
        return (
          <EventListItem key={i} event={event} />
        )
      })}
    </List>
  )
}