"use client";

import { IconBell, IconCloud, IconFolderCode } from "@tabler/icons-react";
import { ArrowUpRightIcon, PlusIcon, RefreshCcwIcon } from "lucide-react";

import { Avatar, AvatarGroup } from "@dotui/registry/ui/avatar";
import { Button } from "@dotui/registry/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@dotui/registry/ui/empty";
import { Link } from "@dotui/registry/ui/link";

export function EmptyDemo() {
  return (
    <div className="grid grid-cols-2 items-center gap-4 p-10">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderCode />
          </EmptyMedia>
          <EmptyTitle>No Projects Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>Create Project</Button>
            <Button>Import Project</Button>
          </div>
        </EmptyContent>
        <Button asChild variant="link" className="text-fg-muted" size="sm">
          <Link>
            Learn More <ArrowUpRightIcon />
          </Link>
        </Button>
      </Empty>

      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <AvatarGroup className="*:data-[slot=avatar]:grayscale">
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
            </AvatarGroup>
          </EmptyMedia>
          <EmptyTitle>No Team Members</EmptyTitle>
          <EmptyDescription>
            Invite your team to collaborate on this project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">
            <PlusIcon />
            Invite Members
          </Button>
        </EmptyContent>
      </Empty>

      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconCloud />
          </EmptyMedia>
          <EmptyTitle>Cloud Storage Empty.</EmptyTitle>
          <EmptyDescription>
            Upload files to your cloud storage to access them anywhere.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">Upload Files</Button>
        </EmptyContent>
      </Empty>

      <Empty className="to-background h-full bg-gradient-to-b from-muted/50 from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconBell />
          </EmptyMedia>
          <EmptyTitle>No Notifications</EmptyTitle>
          <EmptyDescription>
            You&apos;re all caught up. New notifications will appear here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">
            <RefreshCcwIcon />
            Refresh
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
