import { Input } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";

export default function Page() {
  return (
    <SearchField aria-label="Search">
      <Input placeholder="Search..." />
    </SearchField>
  );
}
