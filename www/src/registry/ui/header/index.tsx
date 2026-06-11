'use client'

import * as HeaderPrimitives from 'react-aria-components/Header'

export function Header(
  props: React.ComponentProps<typeof HeaderPrimitives.Header>,
) {
  return <HeaderPrimitives.Header {...props} />
}
