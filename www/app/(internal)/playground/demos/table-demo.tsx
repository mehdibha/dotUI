"use client";

import { useDragAndDrop } from "react-aria-components";
import { useAsyncList, useListData } from "react-stately";

import { Table } from "@dotui/registry-v2/ui/table";

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "User" },
];

export function TableDemo() {
  return (
    <div className="grid w-full grid-cols-2 gap-6">
      {/* Basic table */}
      <Table.Root className="col-span-2">
        <Table.Container>
          <Table>
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column>Role</Table.Column>
            </Table.Header>
            <Table.Body items={users}>
              {(user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Table.Container>
        <Table.Description className="text-center">
          Basic table
        </Table.Description>
      </Table.Root>

      {/* Table with selection */}
      <Table.Root>
        <Table.Container>
          <Table aria-label="Users" selectionMode="single">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column>Role</Table.Column>
            </Table.Header>
            <Table.Body items={users}>
              {(user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Table.Container>
        <Table.Description className="text-center">
          With single selection
        </Table.Description>
      </Table.Root>

      <Table.Root>
        <Table.Container>
          <Table aria-label="Users" selectionMode="single">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column>Role</Table.Column>
            </Table.Header>
            <Table.Body items={users}>
              {(user) => (
                <Table.Row
                  key={user.id}
                  isDisabled={user.id === 2 || user.id === 4}
                >
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Table.Container>
        <Table.Description className="text-center">
          With disabled rows
        </Table.Description>
      </Table.Root>

      <AsyncTable />

      <Table.Root>
        <Table.Container className="h-[223px]">
          <Table aria-label="Users" selectionMode="single">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column>Role</Table.Column>
            </Table.Header>
            <Table.Body items={[]}></Table.Body>
          </Table>
        </Table.Container>
        <Table.Description className="text-center">
          Empty state
        </Table.Description>
      </Table.Root>

      <AsyncSortTable />

      <Table.Root>
        <Table.Container resizable>
          <Table>
            <Table.Header>
              <Table.Column isRowHeader allowsResizing>
                Name
              </Table.Column>
              <Table.Column allowsResizing>Email</Table.Column>
              <Table.Column allowsResizing>Role</Table.Column>
            </Table.Header>
            <Table.Body items={users}>
              {(user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Table.Container>
        <Table.Description className="text-center">
          With resizable columns
        </Table.Description>
      </Table.Root>
    </div>
  );
}

interface Character {
  name: string;
  height: number;
  mass: number;
  birth_year: number;
}

const AsyncTable = () => {
  const list = useAsyncList<Character>({
    async load({ signal, cursor }) {
      if (cursor) {
        cursor = cursor.replace(/^http:\/\//i, "https://");
      }
      const res = await fetch(
        cursor || "https://swapi.py4e.com/api/people/?search=",
        { signal },
      );
      const json = await res.json();
      return {
        items: json.results,
        cursor: json.next,
      };
    },
  });

  return (
    <Table.Root>
      <Table.Container className="h-[223px]">
        <Table aria-label="Users" selectionMode="single">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Birth Year</Table.Column>
            <Table.Column>Height</Table.Column>
            <Table.Column>Mass</Table.Column>
          </Table.Header>
          <Table.Body
            items={list.items}
            isLoading={list.isLoading}
            onLoadMore={list.loadMore}
          >
            {(c) => (
              <Table.Row id={c.name}>
                <Table.Cell>{c.name}</Table.Cell>
                <Table.Cell>{c.birth_year}</Table.Cell>
                <Table.Cell>{c.height}</Table.Cell>
                <Table.Cell>{c.mass}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Table.Container>
      <Table.Description className="text-center">
        With async loading
      </Table.Description>
    </Table.Root>
  );
};

function AsyncSortTable() {
  const list = useAsyncList<Character>({
    async load({ signal }) {
      const res = await fetch(`https://swapi.py4e.com/api/people/?search`, {
        signal,
      });
      const json = await res.json();
      return {
        items: json.results,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column as keyof Character];
          const second = b[sortDescriptor.column as keyof Character];
          let cmp =
            (parseInt(first as string, 10) || first) <
            (parseInt(second as string, 10) || second)
              ? -1
              : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  return (
    <Table.Root>
      <Table.Container className="h-[223px]">
        <Table
          aria-label="Example table with client side sorting"
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
        >
          <Table.Header>
            <Table.Column id="name" isRowHeader allowsSorting>
              Name
            </Table.Column>
            <Table.Column id="height" allowsSorting>
              Height
            </Table.Column>
            <Table.Column id="mass" allowsSorting>
              Mass
            </Table.Column>
            <Table.Column id="birth_year" allowsSorting>
              Birth Year
            </Table.Column>
          </Table.Header>
          <Table.Body items={list.items}>
            {(item) => (
              <Table.Row id={item.name}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.height}</Table.Cell>
                <Table.Cell>{item.mass}</Table.Cell>
                <Table.Cell>{item.birth_year}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Table.Container>
      <Table.Description className="text-center">
        With async sorting
      </Table.Description>
    </Table.Root>
  );
}

interface FileItem {
  id: number;
  name: string;
  date: string;
  type: string;
}

const _ReordableTable = () => {
  const list = useListData({
    initialItems: [
      { id: 1, name: "Games", date: "6/7/2020", type: "File folder" },
      { id: 2, name: "Program Files", date: "4/7/2021", type: "File folder" },
      { id: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
      { id: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
    ],
  });

  const { dragAndDropHooks } = useDragAndDrop<FileItem>({
    getItems: (_keys, items) =>
      items.map((item) => ({
        "text/plain": item.name,
      })),
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys);
      }
    },
  });

  return (
    <Table.Root>
      <Table.Container>
        <Table dragAndDropHooks={dragAndDropHooks}>
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Type</Table.Column>
          </Table.Header>
          <Table.Body items={list.items}>
            {(item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Table.Container>
      <Table.Description className="text-center">
        Reordable table (drag and drop)
      </Table.Description>
    </Table.Root>
  );
};
