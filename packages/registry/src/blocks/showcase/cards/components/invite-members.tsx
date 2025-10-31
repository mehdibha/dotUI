"use client";

import { PlusCircleIcon } from "lucide-react";

import { ExternalLinkIcon } from "@dotui/registry/icons";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Button } from "@dotui/registry/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Separator } from "@dotui/registry/ui/separator";
import { TextField } from "@dotui/registry/ui/text-field";

const teamMembers = [
  {
    name: "shadcn",
    email: "shadcn@vercel.com",
    avatar: "https://github.com/shadcn.png",
    role: "owner",
  },
  {
    name: "rauchg",
    email: "rauchg@vercel.com",
    avatar: "https://github.com/rauchg.png",
    role: "member",
  },
  {
    name: "Lee Robinson",
    email: "lee@cursor.com",
    avatar: "https://github.com/leerob.png",
    role: "member",
  },
];

export function InviteMembers(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
        <CardDescription>
          Collaborate with members on this project.
        </CardDescription>
        <CardAction>
          <Button variant="default">
            <ExternalLinkIcon />
            Invite link
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TextField className="flex-1">
              <Label>Email</Label>
              <Input />
            </TextField>
            <Select defaultValue="member">
              <Label>Role</Label>
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="owner">Owner</SelectItem>
                <SelectItem id="member">Member</SelectItem>
                <SelectItem id="admin">Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
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
                    <Avatar src={member.avatar} size="sm" />
                    <div className="text-sm">
                      <p>{member.name}</p>
                      <p className="text-fg-muted">{member.role}</p>
                    </div>
                  </div>
                  <Select aria-label="Role" defaultSelectedKey={member.role}>
                    <SelectItem id="owner">Owner</SelectItem>
                    <SelectItem id="member">Member</SelectItem>
                    <SelectItem id="admin">Billing</SelectItem>
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
  );
}
