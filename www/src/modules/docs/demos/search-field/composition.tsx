import React from "react";
import { Description, Label } from "@/components/dynamic-ui/field";
import { Input, InputRoot } from "@/components/dynamic-ui/input";
import { SearchFieldRoot } from "@/components/dynamic-ui/search-field";
import { SearchIcon } from "lucide-react";

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
