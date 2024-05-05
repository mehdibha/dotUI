"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";
import {
  BlocksIcon,
  BugPlayIcon,
  FilesIcon,
  GitCompareArrowsIcon,
  MessageSquareIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizableGroup,
} from "@/lib/components/core/default/resizable";
import { Separator } from "@/lib/components/core/default/separator";
import { Tooltip } from "@/lib/components/core/default/tooltip";
import { cn } from "@/lib/utils/classes";

export default function ResizableDemo() {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className={cn("flex h-full w-full flex-col rounded-lg bg-bg-muted text-left")}>
      {/* header */}
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
      </div>
      <Separator />
      <ResizableGroup direction="horizontal">
        <ResizablePanel
          collapsible
          defaultSize={8}
          collapsedSize={8}
          maxSize={80}
          minSize={25}
          className="flex"
          onCollapse={() => setCollapsed(true)}
          onExpand={() => setCollapsed(false)}
        >
          <Nav
            collapsed={collapsed}
            links={[
              {
                label: "Explorer",
                icon: FilesIcon,
              },
              {
                label: "Search",
                icon: SearchIcon,
              },
              {
                label: "Source Control",
                icon: GitCompareArrowsIcon,
              },
              {
                label: "Run and Debug",
                icon: BugPlayIcon,
              },
              {
                label: "Extensions",
                icon: BlocksIcon,
              },
              {
                label: "Chat",
                icon: MessageSquareIcon,
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={88}></ResizablePanel>
      </ResizableGroup>
    </div>
  );
}

interface NavProps {
  collapsed?: boolean;
  links: {
    label: string;
    icon: LucideIcon;
  }[];
}

const Nav = ({ links, collapsed }: NavProps) => {
  return (
    <nav className={cn("flex w-full flex-col items-center space-y-1 px-2 py-4")}>
      {links.map((Link, index) => {
        if (collapsed) {
          return (
            <Tooltip
              key={index}
              delayDuration={0}
              side="right"
              className="flex items-center gap-4"
              aria-label={Link.label}
              content={Link.label}
            >
              <Button variant="ghost" shape="square">
                <Link.icon />
              </Button>
            </Tooltip>
          );
        }
        return (
          <Button
            key={index}
            variant="ghost"
            prefix={<Link.icon />}
            className="w-full text-left"
          >
            <span className="w-32">{Link.label}</span>
          </Button>
        );
      })}
    </nav>
  );
};
