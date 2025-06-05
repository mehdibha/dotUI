"use client";

import React from "react";
import { Radio, RadioGroup } from "@/components/dynamic-ui/radio-group";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/dynamic-ui/table";

const columns: Column[] = [
  { name: "Name", id: "name", isRowHeader: true },
  { name: "Type", id: "type" },
  { name: "Date Modified", id: "date" },
];

const data: Item[] = [
  { id: 1, name: "Games", date: "6/7/2020", type: "File folder" },
  { id: 2, name: "Program Files", date: "4/7/2021", type: "File folder" },
  { id: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
  { id: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
];

type SelectionBehavior = "toggle" | "replace";

export default function Demo() {
  const [selectionBehavior, setSelectionBehavior] =
    React.useState<SelectionBehavior>("toggle");
  return (
    <div className="flex gap-12">
      <TableRoot
        aria-label="Files"
        selectionMode="multiple"
        selectionBehavior={selectionBehavior}
        defaultSelectedKeys={[2, 3]}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn isRowHeader={column.isRowHeader}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow columns={columns}>
              {(column) => <TableCell>{item[column.id]}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </TableRoot>
      <RadioGroup
        label="Behavior"
        value={selectionBehavior}
        onChange={(value) => setSelectionBehavior(value as SelectionBehavior)}
        className="text-sm"
      >
        <Radio value="toggle">Toggle</Radio>
        <Radio value="accent">Replace</Radio>
      </RadioGroup>
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
