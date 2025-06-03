"use client";

import React from "react";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/registry/ui/table.basic";

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
  return (
    <TableContainer resizable>
      <TableRoot aria-label="Files">
        <TableHeader columns={columns}>
          <TableColumn id="name" isRowHeader allowsResizing>
            Name
          </TableColumn>
          <TableColumn id="type" allowsResizing>
            Type
          </TableColumn>
          <TableColumn id="date">Date Modified</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow columns={columns}>
              {(column) => <TableCell>{item[column.id]}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </TableRoot>
    </TableContainer>
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
