"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";

export default function Page() {
  return (
    <div className="h-40 flex items-start">
      <Combobox aria-label="Country">
        <InputGroup>
          <Input placeholder="Select country..." />
          <InputAddon>
            <Button variant="quiet">
              <ChevronDownIcon />
            </Button>
          </InputAddon>
        </InputGroup>
        <ComboboxContent isOpen className="h-36">
          <ComboboxItem>Canada</ComboboxItem>
          <ComboboxItem>France</ComboboxItem>
          <ComboboxItem>Germany</ComboboxItem>
          <ComboboxItem>Japan</ComboboxItem>
          <ComboboxItem>United Kingdom</ComboboxItem>
          <ComboboxItem>United States</ComboboxItem>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
