"use client";

import type { PageTree } from "fumadocs-core/server";
import React from "react";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { ScrollArea } from "@/components/scroll-area";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import { AlignLeftIcon, PanelLeftCloseIcon, SearchIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { Kbd } from "@dotui/ui/components/kbd";

import { Logo } from "./logo";
import { SearchCommand } from "./search-command";
import { NodeList } from "./sidebar";
import { ThemeSwitcher } from "./site-theme-selector";

export const MobileNav = ({
  className,
  items,
}: {
  className?: string;
  items: PageTree.Node[];
}) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <header
      className={cn(
        "bg-bg/95 sticky top-0 z-50 block border-b backdrop-blur-sm",
        className,
      )}
    >
      <div className="container flex h-14 w-full max-w-(--breakpoint-2xl) items-center justify-between gap-1 sm:gap-2">
        <DialogRoot isOpen={isOpen} onOpenChange={setOpen}>
          <Button variant="quiet" size="sm" shape="square">
            <AlignLeftIcon />
          </Button>
          <Dialog
            type="drawer"
            drawerProps={{
              placement: "left",
            }}
            className="flex w-60 flex-col p-0"
          >
            {({ close }) => (
              <div className="z-50 flex h-full flex-col">
                <div>
                  <div className="flex items-center justify-between p-2">
                    <Logo />
                    <Button size="sm" shape="square" onPress={close}>
                      <PanelLeftCloseIcon />
                    </Button>
                  </div>
                  <div className="p-2">
                    <SearchCommand
                      onAction={() => {
                        setOpen(false);
                      }}
                    >
                      <Button
                        prefix={<SearchIcon />}
                        variant="outline"
                        className="bg-bg-inverse/5 text-fg-muted w-full"
                      >
                        <span className="flex-1 text-left">Search docs...</span>
                      </Button>
                    </SearchCommand>
                  </div>
                </div>
                <ScrollArea
                  size="sm"
                  style={{
                    maskImage:
                      "linear-gradient(transparent 2px, white 16px, white calc(100% - 16px), transparent calc(100% - 2px))",
                  }}
                  className="flex-1"
                >
                  <div className="p-2 text-sm">
                    <NodeList items={items} onSelect={close} />
                  </div>
                </ScrollArea>
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-1">
                    <Button
                      href={siteConfig.links.github}
                      target="_blank"
                      size="sm"
                      shape="square"
                      variant="quiet"
                      aria-label="github"
                    >
                      <GitHubIcon />
                    </Button>
                    <Button
                      href={siteConfig.links.twitter}
                      target="_blank"
                      size="sm"
                      shape="square"
                      variant="quiet"
                      aria-label="twitter"
                    >
                      <TwitterIcon />
                    </Button>
                  </div>
                  <ThemeSwitcher />
                </div>
              </div>
            )}
          </Dialog>
        </DialogRoot>
        <span className="hidden sm:block sm:flex-1" />
        <SearchCommand
          onAction={() => {
            setOpen(false);
          }}
        >
          <Button
            size="sm"
            variant="outline"
            prefix={<SearchIcon />}
            suffix={
              <div className="flex items-center gap-0.5 text-xs max-sm:hidden">
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </div>
            }
            className="bg-bg-inverse/5 text-fg-muted gap-2 pr-1 pl-3 max-sm:flex-1"
          >
            <span className="mr-6 flex-1 text-left">Search docs...</span>
          </Button>
        </SearchCommand>
        <Button
          href={siteConfig.links.github}
          target="_blank"
          size="sm"
          shape="square"
          variant="quiet"
          aria-label="github"
        >
          <GitHubIcon />
        </Button>
        <Button
          href={siteConfig.links.twitter}
          target="_blank"
          size="sm"
          shape="square"
          variant="quiet"
          aria-label="twitter"
        >
          <TwitterIcon />
        </Button>
      </div>
    </header>
  );
};
