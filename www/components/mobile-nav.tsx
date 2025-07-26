"use client";

import React from "react";
import { AlignLeftIcon, PanelLeftCloseIcon, SearchIcon } from "lucide-react";
import type { PageTree } from "fumadocs-core/server";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { Kbd } from "@dotui/ui/components/kbd";
import { cn } from "@dotui/ui/lib/utils";

import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { ScrollArea } from "@/components/scroll-area";
import { siteConfig } from "@/config";
import { useMounted } from "@/hooks/use-mounted";
import { UserProfileMenu } from "@/modules/auth/components/user-profile-menu";
import { authClient } from "@/modules/auth/lib/client";
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
  const isMounted = useMounted();
  const { data: session, isPending } = authClient.useSession();
  return (
    <header
      className={cn(
        "sticky top-0 z-50 block border-b bg-bg/95 backdrop-blur-sm",
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
            className="flex w-60 flex-col p-0 !pb-[env(safe-area-inset-bottom)]"
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
                        className="w-full bg-bg-inverse/5 text-fg-muted"
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
        {isMounted && !isPending && (
          <div className="flex flex-1 animate-in items-center gap-2 fade-in">
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
                className="gap-2 bg-bg-inverse/5 pr-1 pl-3 text-fg-muted max-sm:flex-1"
              >
                <span className="mr-6 flex-1 text-left">Search docs...</span>
              </Button>
            </SearchCommand>
            {session ? (
              <UserProfileMenu />
            ) : (
              <Button variant="primary" href="/login" size="sm">
                Sign in
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
