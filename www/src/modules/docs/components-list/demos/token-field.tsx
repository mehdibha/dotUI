import { TokenFieldValue } from "react-aria-components/TokenField"

import { TokenField, TokenInput } from "@/registry/ui/token-field"

export function TokenFieldDemo() {
  return (
    <TokenField
      aria-label="Message"
      allowsNewlines
      defaultValue={
        new TokenFieldValue([
          { type: "text", text: "Ping " },
          { type: "token", text: "@alexmiller" },
          { type: "text", text: " about the " },
          { type: "token", text: "#launch" },
          { type: "text", text: " checklist" },
        ])
      }
      className="max-w-64"
    >
      <TokenInput />
    </TokenField>
  )
}
