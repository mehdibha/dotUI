import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"

export function InputGroupDemo() {
  return (
    <InputGroup className="w-full max-w-[11.5rem]">
      <InputGroupAddon>@</InputGroupAddon>
      <Input placeholder="username" />
    </InputGroup>
  )
}
