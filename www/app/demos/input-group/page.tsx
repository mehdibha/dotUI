import { Input, InputGroup, InputAddon } from "@dotui/registry/ui/input";

export default function Page() {
  return (
    <InputGroup>
      <InputAddon>@</InputAddon>
      <Input placeholder="username" />
    </InputGroup>
  );
}
