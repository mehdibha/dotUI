import { createFileRoute, redirect } from '@tanstack/react-router'

// The components gallery moved into the docs at /docs/components. Keep this path
// as a permanent redirect so existing links and bookmarks don't break.
export const Route = createFileRoute('/_app/components')({
  beforeLoad: () => {
    throw redirect({
      to: '/docs/$',
      params: { _splat: 'components' },
      statusCode: 301,
    })
  },
})
