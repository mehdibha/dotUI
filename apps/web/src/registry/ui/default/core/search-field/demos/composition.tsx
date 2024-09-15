import React from "react";
import { SearchIcon } from "@/__icons__";
import { Description, Label } from "@/registry/ui/default/core/field";
import { Input, InputRoot } from "@/registry/ui/default/core/input";
import { SearchFieldRoot } from "@/registry/ui/default/core/search-field";

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
