"use client";

import { PlusCircleIcon } from "lucide-react";

import { Avatar } from "@dotui/ui/components/avatar";
import { Button } from "@dotui/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/ui/components/card";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Separator } from "@dotui/ui/components/separator";
import { TextField } from "@dotui/ui/components/text-field";
import { ExternalLinkIcon } from "@dotui/ui/icons";

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
          <Button variant="default" prefix={<ExternalLinkIcon />}>
            Invite link
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TextField label="Email" className="flex-1" />
            <Select label="Role" defaultSelectedKey="member">
              <SelectItem id="owner">Owner</SelectItem>
              <SelectItem id="member">Member</SelectItem>
              <SelectItem id="admin">Billing</SelectItem>
            </Select>
          </div>
          <Button prefix={<PlusCircleIcon />}>Add more</Button>
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
        <p className="text-fg-muted text-sm">
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
