'use client'

import { Label } from '@/registry/ui/field'
import {
  TokenField,
  TokenInput,
  TokenSegmentList,
} from '@/registry/ui/token-field'

export default function Demo() {
  return (
    <TokenField
      allowsNewlines
      defaultValue={
        new TokenSegmentList([
          { type: 'text', text: 'Ping ' },
          { type: 'token', text: '@alexmiller' },
          { type: 'text', text: ' about the ' },
          { type: 'token', text: '#launch' },
          { type: 'text', text: ' checklist' },
        ])
      }
      className="w-[320px]"
    >
      <Label>Message</Label>
      <TokenInput />
    </TokenField>
  )
}
