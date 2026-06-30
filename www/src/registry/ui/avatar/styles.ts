import { createStyles } from '@/lib/styles'

import avatarMeta from './meta'

const { useStyles, styles } = createStyles(avatarMeta, {
  base: {
    slots: {
      root: 'group/avatar relative inline-flex size-8 shrink-0 rounded-(--avatar-radius) bg-muted align-middle *:data-badge:absolute *:data-badge:not-with-[right]:not-with-[left]:right-0 *:data-badge:not-with-[bottom]:not-with-[top]:bottom-0',
      image: 'aspect-square size-full rounded-[inherit] object-cover',
      fallback:
        'flex size-full items-center justify-center rounded-[inherit] bg-muted text-sm select-none group-data-[size=sm]/avatar:text-xs',
      badge: [
        'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-fg-on-primary bg-blend-color ring-2 ring-bg select-none with-[left]:right-auto with-[top]:bottom-auto',
        'not-with-[size]:group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'not-with-[size]:group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2',
        'not-with-[size]:group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
      ],
      group:
        'group/avatar-group flex -space-x-2 *:data-avatar:ring-2 *:data-avatar:ring-bg',
      groupCount: [
        'relative flex shrink-0 items-center justify-center rounded-(--avatar-radius) bg-muted text-fg-muted ring-2 ring-bg',
        'size-8 text-sm [&>svg]:size-4',
        'group-data-[size=sm]/avatar-group:size-6 group-data-[size=sm]/avatar-group:text-[0.625rem] group-data-[size=sm]/avatar-group:[&>svg]:size-3',
        'group-data-[size=lg]/avatar-group:size-10 group-data-[size=lg]/avatar-group:text-base group-data-[size=lg]/avatar-group:[&>svg]:size-5',
      ],
    },
    variants: {
      size: {
        sm: { group: '*:data-avatar:size-6', root: 'size-6' },
        md: { group: '*:data-avatar:size-8', root: 'size-8' },
        lg: { group: '*:data-avatar:size-10', root: 'size-10' },
      },
    },
  },
})

export type AvatarStyles = typeof styles

export { useStyles }
