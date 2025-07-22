"use client";

import { PlusCircleIcon } from "lucide-react";

import { Avatar } from "@dotui/ui/components/avatar";
import { Button } from "@dotui/ui/components/button";
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
    avatar: "https://github.com/leeerob.png",
    role: "member",
  },
];

export function InviteMembers() {
  return (
    <div className="w-full max-w-xl rounded-md border p-4 pb-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invite Members</h2>
        <Button prefix={<ExternalLinkIcon />}>Invite link</Button>
      </div>
      <p className="text-fg-muted text-sm">
        Collaborate with members on this project.
      </p>
      <div className="mt-4 space-y-4">
        <Separator />
        <div className="flex items-center gap-2 *:flex-1">
          <TextField label="Email" />
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
      <div className="-mx-4 mt-4 border-t p-4">
        <div className="flex items-center justify-between">
          <p className="text-fg-muted text-sm">
            Learn more about{" "}
            <a href="#" className="text-fg-accent underline underline-offset-4">
              inviting members
            </a>
            .
          </p>
          <Button variant="primary">Invite</Button>
        </div>
      </div>
    </div>
  );
}
