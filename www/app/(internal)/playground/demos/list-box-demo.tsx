"use client";

import { StarIcon } from "lucide-react";

import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/registry-v2/ui/list-box";

const items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Orange" },
  { id: 4, name: "Mango" },
  { id: 5, name: "Pineapple" },
];

export function ListBoxDemo() {
  return (
    <div className="flex flex-col gap-6">
      <ListBox aria-label="Fruits">
        <ListBoxItem>Apple</ListBoxItem>
        <ListBoxItem>Banana</ListBoxItem>
        <ListBoxItem>Orange</ListBoxItem>
        <ListBoxItem>Mango</ListBoxItem>
      </ListBox>

      <ListBox aria-label="Fruits with selection" selectionMode="single">
        {items.map((item) => (
          <ListBoxItem key={item.id} id={item.id}>
            {item.name}
          </ListBoxItem>
        ))}
      </ListBox>

      <ListBox aria-label="Multiple selection" selectionMode="multiple">
        {items.map((item) => (
          <ListBoxItem key={item.id} id={item.id}>
            {item.name}
          </ListBoxItem>
        ))}
      </ListBox>

      <ListBox aria-label="With icons">
        <ListBoxItem prefix={<StarIcon />}>Favorites</ListBoxItem>
        <ListBoxItem prefix={<StarIcon />}>Important</ListBoxItem>
        <ListBoxItem prefix={<StarIcon />}>Archive</ListBoxItem>
      </ListBox>

      <ListBox aria-label="With descriptions">
        <ListBoxItem label="Apple" description="A sweet and crunchy fruit" />
        <ListBoxItem label="Banana" description="A tropical yellow fruit" />
        <ListBoxItem
          label="Orange"
          description="A citrus fruit rich in vitamin C"
        />
      </ListBox>

      <ListBox aria-label="With sections">
        <ListBoxSection title="Fruits">
          <ListBoxItem>Apple</ListBoxItem>
          <ListBoxItem>Banana</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection title="Vegetables">
          <ListBoxItem>Carrot</ListBoxItem>
          <ListBoxItem>Broccoli</ListBoxItem>
        </ListBoxSection>
      </ListBox>

      <ListBox aria-label="With disabled items">
        <ListBoxItem>Enabled item</ListBoxItem>
        <ListBoxItem isDisabled>Disabled item</ListBoxItem>
        <ListBoxItem>Another enabled item</ListBoxItem>
      </ListBox>
    </div>
  );
}
