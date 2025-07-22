"use client";

import { PlusCircleIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Separator } from "@dotui/ui/components/separator";
import { TextField } from "@dotui/ui/components/text-field";
import { ExternalLinkIcon } from "@dotui/ui/icons";
import { Link } from "react-aria-components";

export function InviteMembers() {
  return (
    <div className="w-full max-w-xl rounded-md border p-4 pb-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invite Members</h2>
        <Button prefix={<ExternalLinkIcon />}>Invite link</Button>
      </div>
      <p className="text-fg-muted text-sm">Invite members to your team.</p>
      <div className="space-y-4 mt-4">
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
      </div>
      <div className="-mx-4 border-t p-4 mt-4">
        <div className="flex items-center justify-between">
          <p className="text-fg-muted text-sm">
            Learn more about <Link href="#">inviting members</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
