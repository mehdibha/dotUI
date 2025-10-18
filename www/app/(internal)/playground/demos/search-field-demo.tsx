"use client";

import * as React from "react";

import { SearchField } from "@dotui/registry-v2/ui/search-field";
import { SearchIcon } from "@dotui/registry/icons";
import { Kbd } from "@dotui/registry-v2/ui/kbd";

export function SearchFieldDemo() {
  return (
    <div>
      <SearchField>
        <SearchField.InputGroup>
          <SearchField.InputAddon>
            <SearchIcon />
          </SearchField.InputAddon>
          <SearchField.Input placeholder="Search..." />
          <SearchField.InputAddon>
            <Kbd>⌘ K</Kbd>
          </SearchField.InputAddon>
        </SearchField.InputGroup>
      </SearchField>
    </div>
  );
}
