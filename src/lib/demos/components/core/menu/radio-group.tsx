"use client";

import React from "react";
import { Button } from "@/lib/components/core/default/button";
import {
  MenuContent,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/lib/components/core/default/menu";

export default function MenuDemo() {
  const [position, setPosition] = React.useState("bottom");

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline">Sort</Button>
      </MenuTrigger>
      <MenuContent align="end">
        <MenuLabel>Sort shows</MenuLabel>
        <MenuSeparator />
        <MenuRadioGroup value={position} onValueChange={setPosition}>
          <MenuRadioItem value="top">Title</MenuRadioItem>
          <MenuRadioItem value="bottom">Date added</MenuRadioItem>
          <MenuRadioItem value="right">Manual</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </MenuRoot>
  );
}
