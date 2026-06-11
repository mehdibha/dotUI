'use client'

import * as TextPrimitives from 'react-aria-components/Text'

interface TextProps extends TextPrimitives.TextProps {}

const Text = (props: TextProps) => {
  return <TextPrimitives.Text data-text="" {...props} />
}

export type { TextProps }
export { Text }
