"use client";

import React from "react";
import {
  CalendarIcon,
  FileIcon,
  FolderIcon,
  HexagonIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/registry/ui/default/core/button";
import { Tooltip } from "@/registry/ui/default/core/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[60px_1fr] items-start">
      <div className="flex h-screen flex-col items-center border-r py-4">
        <HexagonIcon />
        <Tooltip content="Search" placement="right" delay={0}>
          <Button shape="square" variant="outline" className="mt-5">
            <SearchIcon />
          </Button>
        </Tooltip>
        <div className="mt-2 flex flex-col gap-2">
          {[
            { icon: <HomeIcon />, label: "Overview" },
            { icon: <UsersIcon />, label: "Team" },
            { icon: <FolderIcon />, label: "Projects" },
            { icon: <CalendarIcon />, label: "Calendar" },
            { icon: <FileIcon />, label: "Documents" },
            { icon: <SettingsIcon />, label: "Settings" },
          ].map(({ icon, label }, index) => (
            <Tooltip key={index} content={label} placement="right" delay={0}>
              <Button shape="square" variant="quiet">
                {icon}
              </Button>
            </Tooltip>
          ))}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
