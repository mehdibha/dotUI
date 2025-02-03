import React from "react";
import { Select, SelectItem } from "@/components/dynamic-core/select";

export default function Demo() {
  return (
    <Select label="Project">
      <SelectItem href="/create-project" target="_blank">
        Create new...
      </SelectItem>
      <SelectItem>DotUI</SelectItem>
      <SelectItem>Palettify</SelectItem>
      <SelectItem>Notionfolio</SelectItem>
    </Select>
  );
}
