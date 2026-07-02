import type { RegistryItem } from '@/registry/types'

const eventCalendarMeta = {
  name: 'event-calendar',
  type: 'registry:ui',
  group: 'calendar',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/event-calendar/base.tsx',
      target: 'ui/event-calendar.tsx',
    },
  ],
  registryDependencies: ['button', 'focus-styles'],
  dependencies: ['date-fns'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--event-calendar-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default eventCalendarMeta
