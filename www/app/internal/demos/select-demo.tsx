"use client";

import { Select } from "@dotui/registry-v2/ui/select";

const items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Orange" },
  { id: 4, name: "Mango" },
  { id: 5, name: "Pineapple" },
];

export function SelectDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-wrap gap-4">
          <Select size={size} label="Select a fruit" placeholder="Choose...">
            {items.map((item) => (
              <Select.Item key={item.id} id={item.id}>
                {item.name}
              </Select.Item>
            ))}
          </Select>
          <Select
            size={size}
            label="Disabled"
            placeholder="Choose..."
            isDisabled
          >
            {items.map((item) => (
              <Select.Item key={item.id} id={item.id}>
                {item.name}
              </Select.Item>
            ))}
          </Select>
        </div>
      ))}
      <Select
        label="With description"
        description="Select your favorite fruit"
        placeholder="Choose..."
      >
        {items.map((item) => (
          <Select.Item key={item.id} id={item.id}>
            {item.name}
          </Select.Item>
        ))}
      </Select>
      <Select
        label="With validation"
        placeholder="Choose..."
        isRequired
        errorMessage="Please select a fruit"
      >
        {items.map((item) => (
          <Select.Item key={item.id} id={item.id}>
            {item.name}
          </Select.Item>
        ))}
      </Select>
    </div>
  );
}
