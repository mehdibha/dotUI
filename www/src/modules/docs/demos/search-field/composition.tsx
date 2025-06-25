import React from "react";
import { SearchIcon } from "lucide-react";

import { Description, Label } from "@dotui/ui/components/field";
import { Input, InputRoot } from "@dotui/ui/components/input";
import { SearchFieldRoot } from "@dotui/ui/components/search-field";

export default function Demo() {
  return (
    <SearchFieldRoot>
      <Label>Search</Label>
      <InputRoot prefix={<SearchIcon />}>
        <Input />
      </InputRoot>
      <Description>Enter your search query.</Description>
    </SearchFieldRoot>
  );
}
