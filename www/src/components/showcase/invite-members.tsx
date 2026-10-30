"use client"

import * as React from "react"

import { ExternalLinkIcon } from "@/registry/__generated__/icons"
import { PlusCircleIcon } from "@/registry/icons"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Link } from "@/registry/ui/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { TextField } from "@/registry/ui/text-field"

const teamMembers = [
  { name: "Ava Moreau", email: "ava@acme.com", initials: "AM", role: "owner" },
  {
    name: "Noah Castell",
    email: "noah@acme.com",
    initials: "NC",
    role: "member",
  },
  {
    name: "Iris Halvorsen",
    email: "iris@acme.com",
    initials: "IH",
    role: "member",
  },
]

export function InviteMembers(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      {/* The action wraps under the title when both don't fit on one line. */}
      <CardHeader className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b">
        <div className="flex min-w-fit grow basis-0 flex-col gap-1">
          <CardTitle>Invite members</CardTitle>
          <CardDescription className="contain-inline-size">
            Collaborate with members on this project.
          </CardDescription>
        </div>
        <CardAction>
          <Button variant="secondary">
            <ExternalLinkIcon />
            Invite link
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* The role drops under the email when both don't fit. */}
          <div className="flex flex-wrap items-end gap-2">
            <TextField className="grow basis-40">
              <Label>Email</Label>
              <Input placeholder="name@acme.com" />
            </TextField>
            <Select defaultValue="member" className="w-auto">
              <Label>Role</Label>
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="owner">Owner</SelectItem>
                <SelectItem id="member">Member</SelectItem>
                <SelectItem id="admin">Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">
            <PlusCircleIcon />
            Add more
          </Button>
          <div>
            <p>Team members</p>
            {/* One grid, so every role select takes the widest value. */}
            <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2">
              {teamMembers.map((member) => (
                <React.Fragment key={member.name}>
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 text-sm compact:text-xs">
                      <p className="truncate">{member.name}</p>
                      <p className="truncate text-fg-muted">{member.email}</p>
                    </div>
                  </div>
                  <Select aria-label="Role" defaultValue={member.role}>
                    <SelectTrigger size="sm" />
                    <SelectContent>
                      <SelectItem id="owner">Owner</SelectItem>
                      <SelectItem id="member">Member</SelectItem>
                      <SelectItem id="admin">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 border-t">
        <p className="text-sm text-fg-muted compact:text-xs">
          Learn more about <Link href="#">inviting members</Link>.
        </p>
        <Button variant="primary">Invite</Button>
      </CardFooter>
    </Card>
  )
}
