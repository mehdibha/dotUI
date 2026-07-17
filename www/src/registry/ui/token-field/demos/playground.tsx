'use client'

import { Label } from '@/registry/ui/field'
import {
  TokenField,
  TokenInput,
  TokenSegmentList,
} from '@/registry/ui/token-field'

const defaultValue = new TokenSegmentList([
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
