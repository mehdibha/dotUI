'use client'

import { TokenFieldValue } from 'react-aria-components/TokenField'

import { Label } from '@/registry/ui/field'
import { TokenField, TokenInput } from '@/registry/ui/token-field'

const defaultValue = new TokenFieldValue([
  { type: 'text', text: 'Ping ' },
  { type: 'token', text: '@alexmiller' },
  { type: 'text', text: ' about the ' },
  { type: 'token', text: '#launch' },
  { type: 'text', text: ' checklist ' },
])

export default function Demo({
  label = 'Message',
  placeholder = 'Write something...',
} = {}) {
  return (
    <TokenField
      allowsNewlines
      defaultValue={defaultValue}
      className="w-[320px]"
    >
      {label && <Label>{label}</Label>}
      <TokenInput data-control-target placeholder={placeholder} />
    </TokenField>
  )
}
