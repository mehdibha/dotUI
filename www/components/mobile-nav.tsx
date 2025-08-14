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

export const MobileNav = ({ items }: { items: PageTree.Node[] }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        size="sm"
        shape="square"
        className={cn("md:hidden", "relative flex items-center justify-center")}
        aria-label="Toggle Menu"
      >
        <div className="relative h-3.5 w-4 [&>span]:absolute [&>span]:left-0 [&>span]:block [&>span]:h-0.5 [&>span]:w-4 [&>span]:rounded-full [&>span]:bg-fg [&>span]:transition-all [&>span]:duration-150 [&>span]:ease-out">
          <span
            className={cn(
              "top-0.25",
              isOpen && "translate-y-[0.31rem] -rotate-45",
            )}
          />
          <span className={cn("top-1.5", isOpen && "-rotate-45 opacity-0")} />
          <span
            className={cn(
              "top-2.75",
              isOpen && "translate-y-[-0.31rem] rotate-45",
            )}
          />
        </div>
      </Button>
      <Dialog
        type="popover"
        mobileType="popover"
        popoverProps={{
          containerPadding: 0,
          offset: 12,
          className:
            "size-full border-0 rounded-none bg-bg/95 backdrop-blur-md",
        }}
        className="overflow-y-auto pt-4"
      >
        {({ close }) => (
          <div className="flex flex-col gap-12">
            <div className="space-y-2">
              <div className="text-lg font-medium text-fg-muted">Menu</div>
              <div className="flex flex-col gap-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/docs/introduction", label: "Docs" },
                  { href: "/docs/components/button", label: "Components" },
                  { href: "/blocks", label: "Blocks" },
                  { href: "/styles", label: "Styles" },
                ].map((item) => (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    onOpenChange={close}
                  >
                    {item.label}
                  </MobileLink>
                ))}
              </div>
            </div>
            {items?.map((group, index) => {
              if (group.type === "folder") {
                return (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="text-lg font-medium text-fg-muted">
                      {group.name}
                    </div>
                    <div className="flex flex-col gap-3">
                      {group.children.map((item, itemIndex) => {
                        if (item.type === "page") {
                          return (
                            <MobileLink
                              key={itemIndex}
                              href={item.url}
                              onOpenChange={close}
                            >
                              {item.name}
                            </MobileLink>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              }
              return null;
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
        const hrefString =
          typeof href === "string" ? href : href.pathname || "";
        router.push(hrefString);
        onOpenChange?.(false);
      }}
      className={cn("text-2xl font-medium", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
