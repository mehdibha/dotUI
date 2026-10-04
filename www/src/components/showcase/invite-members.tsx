"use client"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import { TextField } from "@/registry/ui/text-field"

const teamMembers = [
  { name: "Ava Moreau", initials: "AM", role: "owner" },
  { name: "Noah Castell", initials: "NC", role: "member" },
  { name: "Iris Halvorsen", initials: "IH", role: "member" },
]

export function InviteMembers(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
        <CardDescription>
          Collaborate with members on this project.
        </CardDescription>
        <CardAction>
          <Button variant="secondary">
            <ExternalLinkIcon />
            Invite link
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <TextField className="flex-1">
              <Label>Email</Label>
              <Input placeholder="colleague@example.com" />
            </TextField>
            <Select defaultValue="member" className="w-32 shrink-0">
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
            <div className="mt-2 space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p>{member.name}</p>
                      <p className="text-fg-muted">{member.role}</p>
                    </div>
                  </div>
                  <Select
                    aria-label="Role"
                    defaultValue={member.role}
                    className="w-28 shrink-0"
                  >
                    <SelectTrigger size="sm" />
                    <SelectContent>
                      <SelectItem id="owner">Owner</SelectItem>
                      <SelectItem id="member">Member</SelectItem>
                      <SelectItem id="admin">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between">
        <p className="text-sm text-fg-muted">
          Learn more about{" "}
          <a href="#" className="text-fg-accent underline underline-offset-4">
            inviting members
          </a>
          .
        </p>
        <Button variant="primary">Invite</Button>
      </CardFooter>
    </Card>
  )
}
