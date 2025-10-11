"use client";

import { IconBell, IconCloud, IconFolderCode } from "@tabler/icons-react";
import { ArrowUpRightIcon, PlusIcon, RefreshCcwIcon } from "lucide-react";

import { Avatar } from "@dotui/registry-v2/ui/avatar";
import { Button } from "@dotui/registry-v2/ui/button";
import { Empty } from "@dotui/registry-v2/ui/empty";

export function EmptyDemo() {
  return (
    <div className="grid grid-cols-2 items-center gap-4 p-10">
      <Empty>
        <Empty.Header>
          <Empty.Media variant="icon">
            <IconFolderCode />
          </Empty.Media>
          <Empty.Title>No Projects Yet</Empty.Title>
          <Empty.Description>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <div className="flex gap-2">
            <Button>Create Project</Button>
            <Button>Import Project</Button>
          </div>
        </Empty.Content>
        <Button href="#" variant="link" className="text-fg-muted" size="sm">
          Learn More <ArrowUpRightIcon />
        </Button>
      </Empty>

      <Empty>
        <Empty.Header>
          <Empty.Media>
            <Avatar.Group className="*:data-[slot=avatar]:grayscale">
              <Avatar
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                fallback="CN"
              />
              <Avatar
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
                fallback="LR"
              />
              <Avatar
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
                fallback="ER"
              />
            </Avatar.Group>
          </Empty.Media>
          <Empty.Title>No Team Members</Empty.Title>
          <Empty.Description>
            Invite your team to collaborate on this project.
          </Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <Button size="sm">
            <PlusIcon />
            Invite Members
          </Button>
        </Empty.Content>
      </Empty>

      <Empty className="border border-dashed">
        <Empty.Header>
          <Empty.Media variant="icon">
            <IconCloud />
          </Empty.Media>
          <Empty.Title>Cloud Storage Empty.</Empty.Title>
          <Empty.Description>
            Upload files to your cloud storage to access them anywhere.
          </Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <Button size="sm">Upload Files</Button>
        </Empty.Content>
      </Empty>

      <Empty className="to-background h-full bg-gradient-to-b from-muted/50 from-30%">
        <Empty.Header>
          <Empty.Media variant="icon">
            <IconBell />
          </Empty.Media>
          <Empty.Title>No Notifications</Empty.Title>
          <Empty.Description>
            You&apos;re all caught up. New notifications will appear here.
          </Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <Button size="sm">
            <RefreshCcwIcon />
            Refresh
          </Button>
        </Empty.Content>
      </Empty>
    </div>
  );
}
