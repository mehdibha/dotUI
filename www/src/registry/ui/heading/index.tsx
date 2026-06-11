'use client'

import * as HeadingPrimitives from 'react-aria-components/Heading'

interface HeadingProps extends React.ComponentProps<
  typeof HeadingPrimitives.Heading
> {}

function Heading(
  props: React.ComponentProps<typeof HeadingPrimitives.Heading>,
) {
  return <HeadingPrimitives.Heading {...props} />
}

export type { HeadingProps }
export { Heading }
