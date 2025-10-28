"use client";

import { SearchIcon } from "@dotui/registry/icons";
import { Input, InputAddon, InputGroup } from "@dotui/registry-v2/ui/input";
import { Kbd } from "@dotui/registry-v2/ui/kbd";
import { SearchField } from "@dotui/registry-v2/ui/search-field";

export function SearchFieldDemo() {
  return (
    <div>
      <SearchField>
        <InputGroup>
          <InputAddon>
            <SearchIcon />
          </InputAddon>
          <Input placeholder="Search..." />
          <InputAddon>
            <Kbd>⌘ K</Kbd>
          </InputAddon>
        </InputGroup>
      </SearchField>
    </div>
  );
}
