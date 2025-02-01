"use client";

import {
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from "@/registry/core/table_basic";

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

type Item = {
  id: number;
  name: string;
  date: string;
  type: string;
};

interface Column {
  id: keyof Omit<Item, "id">;
  name: string;
  isRowHeader?: boolean;
}
