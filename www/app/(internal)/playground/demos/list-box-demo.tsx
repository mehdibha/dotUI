"use client";

import { ListBox } from "@dotui/registry-v2/ui/list-box";

const items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Orange" },
  { id: 4, name: "Mango" },
  { id: 5, name: "Pineapple" },
  { id: 6, name: "Kiwi" },
  { id: 7, name: "Strawberry" },
  { id: 8, name: "Blueberry" },
  { id: 9, name: "Raspberry" },
  { id: 10, name: "Blackberry" },
  { id: 11, name: "Cherry" },
  { id: 12, name: "Pear" },
  { id: 13, name: "Plum" },
  { id: 14, name: "Peach" },
  { id: 15, name: "Nectarine" },
];

export function ListBoxDemo() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <ListBox aria-label="Fruits" items={items}>
        {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
      </ListBox>

      <ListBox aria-label="Fruits" items={items} selectionMode="single">
        {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
      </ListBox>

      <ListBox aria-label="Fruits" items={items} selectionMode="multiple">
        {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
      </ListBox>

      {/* with sections, description item, icon, suffix, prefix... */}
    </div>
  );
}
