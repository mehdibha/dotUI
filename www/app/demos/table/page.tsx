"use client";

import {
  RiCheckboxCircleFill,
  RiProgress4Line,
  RiProgress6Line,
} from "@remixicon/react";
import {
  AlertTriangle,
  Circle,
  CircleDashedIcon,
  MoreHorizontal,
  Zap,
} from "lucide-react";

import { Badge } from "@dotui/registry/ui/badge";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Overlay } from "@dotui/registry/ui/overlay";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@dotui/registry/ui/table";

export const statuses = [
  {
    value: "draft",
    label: "Draft",
    variant: "default",
    icon: CircleDashedIcon,
  },
  {
    value: "in progress",
    label: "In progress",
    variant: "info",
    icon: RiProgress4Line,
  },
  {
    value: "in review",
    label: "In review",
    variant: "warning",
    icon: RiProgress6Line,
  },
  {
    value: "done",
    label: "Done",
    variant: "success",
    icon: RiCheckboxCircleFill,
  },
] as const;

export const priorities = [
  {
    value: "P0",
    label: "P0",
    variant: "danger",
    icon: AlertTriangle,
  },
  {
    value: "P1",
    label: "P1",
    variant: "warning",
    icon: Zap,
  },
  {
    value: "P2",
    label: "P2",
    variant: "info",
    icon: Circle,
  },
  {
    value: "P3",
    label: "P3",
    variant: "default",
    icon: Circle,
  },
] as const;

export const types = [
  {
    value: "feature",
    label: "Feature",
    variant: "info",
  },
  {
    value: "bug",
    label: "Bug",
    variant: "danger",
  },
  {
    value: "tech debt",
    label: "Tech Debt",
    variant: "warning",
  },
  {
    value: "spike",
    label: "Spike",
    variant: "info",
  },
  {
    value: "chore",
    label: "Chore",
    variant: "neutral",
  },
  {
    value: "performance",
    label: "Performance",
    variant: "success",
  },
] as const;

interface Column {
  id: keyof Omit<Item, "id"> | "actions";
  name: string;
  isRowHeader?: boolean;
}

const columns: Column[] = [
  { name: "Title", id: "title", isRowHeader: true },
  { name: "Priority", id: "priority" },
  { name: "Status", id: "status" },
  { name: "Assignee", id: "assignee" },
  { name: "Story Points", id: "storyPoints" },
  { name: "", id: "actions" },
];

interface Item {
  id: number;
  title: string;
  priority: string;
  status: string;
  assignee: string;
  storyPoints: string;
  type: string;
}

interface User {
  username: string;
  name: string;
  avatar: string;
}

export const users: User[] = [
  {
    username: "shadcn",
    name: "shadcn",
    avatar: "https://github.com/shadcn.png",
  },
  {
    username: "tannerlinsley",
    name: "Tanner Linsley",
    avatar: "https://github.com/tannerlinsley.png",
  },
  {
    username: "t3dotgg",
    name: "Theo Browne",
    avatar: "https://github.com/t3dotgg.png",
  },
  {
    username: "rauchg",
    name: "Guillermo Rauch",
    avatar: "https://github.com/rauchg.png",
  },
  {
    username: "leerob",
    name: "Lee Robinson",
    avatar: "https://github.com/leerob.png",
  },
  {
    username: "steventey",
    name: "Steven Tey",
    avatar: "https://github.com/steventey.png",
  },
] as const;

const data: Item[] = [
  {
    id: 1,
    title: "Refactor AuthProvider to support SSO + 2FA",
    priority: "P0",
    status: "in progress",
    assignee: "shadcn",
    storyPoints: "13",
    type: "feature",
  },
  {
    id: 2,
    title: "Fix race condition in payment webhooks",
    priority: "P1",
    status: "in review",
    assignee: "tannerlinsley",
    storyPoints: "5",
    type: "bug",
  },
  {
    id: 3,
    title: "Migrate legacy API from REST to GraphQL",
    priority: "P2",
    status: "draft",
    assignee: "t3dotgg",
    storyPoints: "21",
    type: "tech debt",
  },
  {
    id: 4,
    title: "Add Storybook stories for Button variants",
    priority: "P3",
    status: "done",
    assignee: "rauchg",
    storyPoints: "3",
    type: "chore",
  },
  {
    id: 5,
    title: "Spike: Evaluate Redis vs Kafka for event streaming",
    priority: "P2",
    status: "in progress",
    assignee: "leerob",
    storyPoints: "8",
    type: "spike",
  },
  {
    id: 6,
    title: "Implement lazy loading for ProductGrid component",
    priority: "P1",
    status: "draft",
    assignee: "steventey",
    storyPoints: "5",
    type: "performance",
  },
];

export default function Page() {
  return (
    <Table aria-label="Development Team Backlog" selectionMode="multiple">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn isRowHeader={column.isRowHeader}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data} className="max-h-30">
        {(item) => (
          <TableRow columns={columns}>
            <TableCell>
              {() => {
                const type = types.find((t) => t.value === item.type);
                if (!type) return null;
                return (
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{type?.label || item.type}</Badge>
                    <span className="truncate">{item.title}</span>
                  </div>
                );
              }}
            </TableCell>
            <TableCell>
              {(() => {
                const priority = priorities.find(
                  (p) => p.value === item.priority,
                );
                if (!priority) return null;
                return (
                  <Badge variant={priority.variant}>{priority.label}</Badge>
                );
              })()}
            </TableCell>
            <TableCell>
              {(() => {
                const status = statuses.find((s) => s.value === item.status);
                if (!status) return null;
                const StatusIcon = status.icon || Circle;
                return (
                  <Badge variant={status.variant}>
                    <StatusIcon />
                    <span>{status?.label || item.status}</span>
                  </Badge>
                );
              })()}
            </TableCell>
            <TableCell>
              {(() => {
                const user = users.find((u) => u.username === item.assignee);
                if (!user) return null;
                return (
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-fg-muted">{user.name}</span>
                  </div>
                );
              })()}
            </TableCell>
            <TableCell>
              <Badge className="bg-accent-muted px-1 text-fg-accent">
                {item.storyPoints}
              </Badge>
            </TableCell>
            <TableCell>
              <Menu>
                <Button variant="quiet" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Overlay type="popover">
                  <MenuContent>
                    <MenuItem>Edit</MenuItem>
                    <MenuItem>Duplicate</MenuItem>
                    <MenuItem>Archive</MenuItem>
                    <MenuItem variant="danger">Delete</MenuItem>
                  </MenuContent>
                </Overlay>
              </Menu>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
