"use client";

import React from "react";
import type { SortDescriptor } from "react-aria-components";

import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@dotui/ui/components/table";

const columns: Column[] = [
  { name: "Name", id: "name", isRowHeader: true },
  { name: "Type", id: "type" },
  { name: "Date Modified", id: "date" },
];

const items: Item[] = [
  { id: 1, name: "Games", date: "6/7/2020", type: "File folder" },
  { id: 2, name: "Program Files", date: "4/7/2021", type: "File folder" },
  { id: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
  { id: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
];

export default function Demo() {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const sortedItems = React.useMemo(() => {
    return items.sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Item] as string;
      const second = b[sortDescriptor.column as keyof Item] as string;
      let cmp = first.localeCompare(second);
      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }
      return cmp;
    });
  }, [sortDescriptor]);

  return (
    <TableRoot
      aria-label="Files"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        <TableColumn id="name" isRowHeader allowsSorting>
          Name
        </TableColumn>
        <TableColumn id="type" allowsSorting>
          Type
        </TableColumn>
        <TableColumn id="date">Date Modified</TableColumn>
      </TableHeader>
      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow columns={columns}>
            {(column) => <TableCell>{item[column.id]}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </TableRoot>
  );
}

interface Item {
  id: number;
  name: string;
  date: string;
  type: string;
}

interface Column {
  id: keyof Omit<Item, "id">;
  name: string;
  isRowHeader?: boolean;
}
