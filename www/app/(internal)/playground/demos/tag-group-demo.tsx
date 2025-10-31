"use client";

import { Tag, TagGroup, TagList } from "@dotui/registry/ui/tag-group";

const _tags = [
  { id: 1, name: "React" },
  { id: 2, name: "TypeScript" },
  { id: 3, name: "Next.js" },
  { id: 4, name: "Tailwind CSS" },
];

export function TagGroupDemo() {
  return (
    <div className="flex flex-col gap-6">
      <TagGroup>
        <TagList>
          <Tag id="react">React</Tag>
          <Tag id="typescript">TypeScript</Tag>
          <Tag id="nextjs">Next.js</Tag>
          <Tag id="tailwindcss">Tailwind CSS</Tag>
        </TagList>
      </TagGroup>
    </div>
  );
}
