import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'

export default function Demo() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupAddon>https://</InputGroupAddon>
      <Input placeholder="example.com" />
    </InputGroup>
  )
}
