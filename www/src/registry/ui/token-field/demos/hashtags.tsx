'use client'

import { TokenSegmentList } from '@/registry/lib/react-aria-token-field'
import type { TokenFieldSegment } from '@/registry/lib/react-aria-token-field'
import { Label } from '@/registry/ui/field'
import { TokenField, TokenInput } from '@/registry/ui/token-field'

// Overriding `tokenize` converts typed text into tokens automatically — here
// anything matching #hashtag or @username becomes a token once a space follows.
class HashtagSegmentList extends TokenSegmentList {
  static tokenize(text: string): HashtagSegmentList {
    const list = new this([])
    return new this(list.tokenize(text))
  }

  protected tokenize(text: string): TokenFieldSegment[] {
    if (text.length === 0) return [{ type: 'text', text }]

    const regex = /(?<=\s|^)[#@]\S+(?=\s)/g
    const segments: TokenFieldSegment[] = []
    let start = 0
    let match: RegExpExecArray | null = null
    while ((match = regex.exec(text))) {
      if (match.index > start) {
        segments.push({ type: 'text', text: text.slice(start, match.index) })
      }
      segments.push({ type: 'token', text: match[0] })
      start = match.index + match[0].length
    }
    if (start < text.length) {
      segments.push({ type: 'text', text: text.slice(start) })
    }
    return segments
  }
}

export default function Demo() {
  return (
    <TokenField
      allowsNewlines
      defaultValue={HashtagSegmentList.tokenize(
        'This field tokenizes #hashtags and @usernames as you type. ',
      )}
      className="w-[320px]"
    >
      <Label>Post</Label>
      <TokenInput />
    </TokenField>
  )
}
