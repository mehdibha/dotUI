import React from "react";

import { Select, SelectItem } from "@dotui/ui/components/select";

export default function Demo() {
  return (
    <Select label="Project">
      <SelectItem href="#">Create new...</SelectItem>
      <SelectItem>DotUI</SelectItem>
      <SelectItem>Palettify</SelectItem>
      <SelectItem>Notionfolio</SelectItem>
    </Select>
  );
}
