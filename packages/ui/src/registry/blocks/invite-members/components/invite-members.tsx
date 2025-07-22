"use client";

import { Button } from "@dotui/ui/components/button";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Separator } from "@dotui/ui/components/separator";
import { TextField } from "@dotui/ui/components/text-field";
import { ExternalLinkIcon } from "@dotui/ui/icons";

export function InviteMembers() {
  return (
    <div className="w-full max-w-xl rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invite Members</h2>
        <Button prefix={<ExternalLinkIcon />}>Invite link</Button>
      </div>
      <p className="text-fg-muted text-sm">Invite members to your team.</p>
      <Separator />
      <div className="flex items-center gap-2">
        <TextField label="Email" />
        <Select label="Role">
          <SelectItem id="admin">Admin</SelectItem>
          <SelectItem id="user">User</SelectItem>
          <SelectItem id="viewer">Viewer</SelectItem>
          <SelectItem id="guest">Guest</SelectItem>
        </Select>
      </div>
    </div>
  );
}
