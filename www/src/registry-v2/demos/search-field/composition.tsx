import React from "react";
import { Description, Label } from "@/components/dynamic-core/field";
import { Input, InputRoot } from "@/components/dynamic-core/input";
import { SearchFieldRoot } from "@/components/dynamic-core/search-field";
import { SearchIcon } from "@/__icons__";

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
