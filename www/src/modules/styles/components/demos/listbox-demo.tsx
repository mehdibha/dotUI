import React from "react";
import { FileIcon, FolderIcon, ImageIcon } from "lucide-react";
import { ListBox, ListBoxItem } from "@/components/dynamic-ui/list-box";

export function ListBoxDemo() {
  return (
    <div className="flex gap-8">
      <ListBox aria-label="File types" selectionMode="single" className="w-48">
        <ListBoxItem textValue="Documents" prefix={<FolderIcon />}>
          Documents
        </ListBoxItem>
        <ListBoxItem textValue="Images" prefix={<ImageIcon />}>
          Images
        </ListBoxItem>
        <ListBoxItem textValue="Files" isDisabled prefix={<FileIcon />}>
          Files
        </ListBoxItem>
      </ListBox>
    </div>
  );
}
