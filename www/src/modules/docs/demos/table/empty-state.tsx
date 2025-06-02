"use client";

import {
  TableRoot,
  TableHeader,
  TableBody,
  TableColumn,
} from "@/registry/ui/table.basic";

export default function Demo() {
  return (
    <div className="flex gap-8">
      <TableRoot aria-label="Files">
        <TableHeader>
          <TableColumn id="name" isRowHeader>
            Name
          </TableColumn>
          <TableColumn id="type">Type</TableColumn>
          <TableColumn id="date">Date Modified</TableColumn>
        </TableHeader>
        <TableBody>{[]}</TableBody>
      </TableRoot>

      <TableRoot aria-label="Files">
        <TableHeader>
          <TableColumn id="name" isRowHeader>
            Name
          </TableColumn>
          <TableColumn id="type">Type</TableColumn>
          <TableColumn id="date">Date Modified</TableColumn>
        </TableHeader>
        <TableBody renderEmptyState={() => "Nothing here."}>{[]}</TableBody>
      </TableRoot>
    </div>
  );
}
