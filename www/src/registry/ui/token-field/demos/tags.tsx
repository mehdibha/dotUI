"use client"

import { TokenFieldValue } from "react-aria-components/TokenField"
import type { TokenFieldSegment } from "react-aria-components/TokenField"

import { Label } from "@/registry/ui/field"
import { TokenField, TokenInput } from "@/registry/ui/token-field"

// A tag input: comma, space, or newline turns the preceding text into a tag.
class TagFieldValue extends TokenFieldValue {
  protected tokenize(text: string): TokenFieldSegment[] {
    const parts = text.split(/[, \n]/)
    const segments: TokenFieldSegment[] = parts.map((part, i) => {
      if (i === parts.length - 1 || part.length === 0) {
        return { type: "text", text: part }
      }
      return { type: "token", text: part }
    })
    if (parts.at(-1)?.length === 0) segments.pop()
    return segments
  }

  toString(): string {
    return this.segments.map((segment) => segment.text).join(", ")
  }
}

export default function Demo() {
  return (
    <TokenField
      defaultValue={
        new TagFieldValue([
          { type: "token", text: "Design" },
          { type: "token", text: "Engineering" },
          { type: "token", text: "Marketing" },
        ])
      }
      className="w-[320px]"
    >
      <Label>Categories</Label>
      <TokenInput className="min-h-0" />
    </TokenField>
  )
}
