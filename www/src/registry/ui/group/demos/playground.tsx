"use client"

import { Button } from "@/registry/ui/button"
import { Group, type GroupProps } from "@/registry/ui/group"
import { Input, InputGroup } from "@/registry/ui/input"

export default function Demo({
  orientation = "horizontal",
  isDisabled = false,
  isInvalid = false,
  isReadOnly = false,
}: GroupProps = {}) {
  return (
    <Group
      orientation={orientation}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
    >
      <InputGroup
        data-control-target
        isDisabled={isDisabled}
        isInvalid={isInvalid}
      >
        <Input
          data-control-target
          aria-label="Email"
          placeholder="you@example.com"
          disabled={isDisabled}
          aria-invalid={isInvalid}
          readOnly={isReadOnly}
        />
      </InputGroup>
      <Button data-control-target isDisabled={isDisabled}>
        Subscribe
      </Button>
    </Group>
  )
}
