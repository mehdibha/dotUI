"use client";


import { Tree } from "@dotui/registry-v2/ui/tree";

export function TreeDemo() {
  return (
    <div className="flex items-center justify-center p-8 text-fg-muted">
      <Tree
        aria-label="Files"
        items={items}
        selectionMode="multiple"
        className="w-96 border"
      >
        {function renderItem(item) {
          return (
            <Tree.Item textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Tree.Collection items={item.children}>
                {renderItem}
              </Tree.Collection>
            </Tree.Item>
          );
        }}
      </Tree>
    </div>
  );
}

interface FileType {
  id: string;
  title: string;
  type: "directory" | "file";
  children: FileType[];
}

const items: FileType[] = [
  {
    id: "1",
    title: "Documents",
    type: "directory",
    children: [
      {
        id: "2",
        title: "Project",
        type: "directory",
        children: [
          { id: "3", title: "Weekly Report", type: "file", children: [] },
          { id: "4", title: "Budget", type: "file", children: [] },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Photos",
    type: "directory",
    children: [
      { id: "6", title: "Image 1", type: "file", children: [] },
      { id: "7", title: "Image 2", type: "file", children: [] },
    ],
  },
];
