"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuIcon, PanelLeftCloseIcon, SearchIcon } from "lucide-react";
import type { PageTree } from "fumadocs-core/server";
import type { LinkProps } from "next/link";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { cn } from "@dotui/ui/lib/utils";

export const MobileNav = ({
  className,
  items,
}: {
  className?: string;
  items: PageTree.Node[];
}) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setOpen}>
      <Button size="sm" shape="square" className="md:hidden">
        <MenuIcon />
      </Button>
      <Dialog
        type="popover"
        mobileType="popover"
        popoverProps={{
          containerPadding: 0,
          offset: 12,
          className: "size-full",
        }}
        className="p-0"
      >
        {({ close }) => (
          <div className="flex flex-col gap-8">
            {items?.map((group, index) => {
              if (group.type === "folder") {
                return (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="text-muted-foreground text-sm font-medium">
                      {group.name}
                    </div>
                    <div className="flex flex-col gap-3">
                      {group.children.map((item) => {
                        if (item.type === "page") {
                          return (
                            <MobileLink
                              key={`${item.url}-${index}`}
                              href={item.url}
                              onOpenChange={setOpen}
                            >
                              {item.name}
                            </MobileLink>
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </Dialog>
    </DialogRoot>
  );
};

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-2xl font-medium", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
