"use client";

import { SearchIcon } from "@dotui/registry/icons";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { Kbd } from "@dotui/registry/ui/kbd";
import { SearchField } from "@dotui/registry/ui/search-field";

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
