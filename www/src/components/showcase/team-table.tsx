"use client"

import { MoreHorizontalIcon } from "@/registry/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

const members = [
  {
    id: "shadcn",
    name: "shadcn",
    email: "shadcn@vercel.com",
    avatar: "https://github.com/shadcn.png",
    role: "Owner",
    roleVariant: "accent",
  },
  {
    id: "rauchg",
    name: "Guillermo Rauch",
    email: "rauchg@vercel.com",
    avatar: "https://github.com/rauchg.png",
    role: "Admin",
    roleVariant: "info",
  },
  {
    id: "leerob",
    name: "Lee Robinson",
    email: "lee@cursor.com",
    avatar: "https://github.com/leerob.png",
    role: "Member",
    roleVariant: "neutral",
  },
  {
    id: "emilkowalski",
    name: "Emil Kowalski",
    email: "emil@sonner.dev",
    avatar: "https://github.com/emilkowalski.png",
    role: "Member",
    roleVariant: "neutral",
  },
  {
    id: "delbaoliveira",
    name: "Delba de Oliveira",
    email: "delba@vercel.com",
    avatar: "https://github.com/delbaoliveira.png",
    role: "Billing",
    roleVariant: "warning",
  },
] as const

export function TeamTable(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>
          Manage who has access to this workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TableContainer>
          <Table aria-label="Team members">
            <TableHeader>
              <TableColumn isRowHeader className="w-full">
                Member
              </TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn className="w-10">
                <span className="sr-only">Actions</span>
              </TableColumn>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id} textValue={member.name}>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2.5 py-1">
                      <Avatar size="sm" className="shrink-0">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {member.name}
                        </p>
                        <p className="truncate text-xs text-fg-muted">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge appearance="subtle" variant={member.roleVariant}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Menu>
                      <Button
                        aria-label={`Open actions for ${member.name}`}
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        className="-mr-1"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                      <Popover placement="bottom end">
                        <MenuContent>
                          <MenuItem>Change role</MenuItem>
                          <MenuItem>Resend invite</MenuItem>
                          <MenuItem variant="danger">Remove</MenuItem>
                        </MenuContent>
                      </Popover>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-fg-muted">5 of 12 members</p>
      </CardFooter>
    </Card>
  )
}
