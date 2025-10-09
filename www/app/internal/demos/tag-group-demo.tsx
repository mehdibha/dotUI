"use client";

import { Tag, TagGroup } from "@dotui/registry-v2/ui/tag-group";

const tags = [
  { id: 1, name: "React" },
  { id: 2, name: "TypeScript" },
  { id: 3, name: "Next.js" },
  { id: 4, name: "Tailwind CSS" },
];

export function TagGroupDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <TagGroup key={size} label={`Size: ${size}`} selectionMode="multiple">
          {tags.map((tag) => (
            <Tag key={tag.id} size={size} id={tag.id}>
              {tag.name}
            </Tag>
          ))}
        </TagGroup>
      ))}

      <TagGroup label="Default variant" selectionMode="single">
        {tags.map((tag) => (
          <Tag key={tag.id} id={tag.id}>
            {tag.name}
          </Tag>
        ))}
      </TagGroup>

      <TagGroup label="Quiet variant" selectionMode="multiple">
        {tags.map((tag) => (
          <Tag key={tag.id} id={tag.id} variant="quiet">
            {tag.name}
          </Tag>
        ))}
      </TagGroup>

      <TagGroup label="Outline variant" selectionMode="multiple">
        {tags.map((tag) => (
          <Tag key={tag.id} id={tag.id} variant="outline">
            {tag.name}
          </Tag>
        ))}
      </TagGroup>

      <TagGroup label="Accent variant" selectionMode="multiple">
        {tags.map((tag) => (
          <Tag key={tag.id} id={tag.id} variant="accent">
            {tag.name}
          </Tag>
        ))}
      </TagGroup>

      <TagGroup
        label="Removable tags"
        description="Click the × to remove tags"
        selectionMode="multiple"
        onRemove={(keys) => console.log("Removed:", keys)}
      >
        {tags.map((tag) => (
          <Tag key={tag.id} id={tag.id}>
            {tag.name}
          </Tag>
        ))}
      </TagGroup>
    </div>
  );
}
