"use client";

import React from "react";
import {
  Label,
  Button,
  ListBox,
  ListBoxItem,
  Select,
  SelectValue,
  Popover,
} from "react-aria-components";

export default function SelectDemo() {
  return (
    <div className="flex flex-col space-y-4">
      <Select>
        <Label>Favorite Animal</Label>
        <Button>
          <SelectValue />
          <span aria-hidden="true">▼</span>
        </Button>
        <Popover>
          <ListBox>
            <ListBoxItem>Aardvark</ListBoxItem>
            <ListBoxItem>Cat</ListBoxItem>
            <ListBoxItem>Dog</ListBoxItem>
            <ListBoxItem>Kangaroo</ListBoxItem>
            <ListBoxItem>Panda</ListBoxItem>
            <ListBoxItem>Snake</ListBoxItem>
          </ListBox>
        </Popover>
      </Select>
    </div>
  );
}