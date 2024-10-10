"use client";

import Link from "next/link";
import type { PageTree } from "fumadocs-core/server";
import { AlignLeftIcon, PanelLeftCloseIcon, SearchIcon } from "lucide-react";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { Avatar } from "@/registry/ui/default/core/avatar";
import { Button } from "@/registry/ui/default/core/button";
import { Dialog, DialogRoot } from "@/registry/ui/default/core/dialog";
import { ScrollArea } from "@/registry/ui/default/core/scroll-area";
import { siteConfig } from "@/config";
import { NodeList } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

export const MobileNav = ({ items }: { items: PageTree.Node[] }) => {
  return (
    <header className="bg-bg sticky top-0 z-50 block border-b backdrop-blur-md sm:hidden">
      <div className="container flex h-14 w-full max-w-screen-2xl items-center justify-between">
        <DialogRoot>
          <Button variant="quiet" size="sm" shape="square">
            <AlignLeftIcon />
          </Button>
          <Dialog type="drawer" placement="left" className="w-60 !p-0">
            {({ close }) => (
              <div className="flex h-screen flex-col">
                <div className="flex items-center justify-between p-2">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 rounded opacity-100 transition-[opacity,transform] duration-300 ease-out"
                  >
                    <Avatar
                      src={siteConfig.global.logo}
                      alt={siteConfig.global.name}
                      width={24}
                      height={24}
                      loading="lazy"
                      className="m-1 size-6 rounded-sm"
                    />
                    <div className="font-josephin mt-[5px] font-bold leading-normal tracking-tighter">
                      {siteConfig.global.name}
                    </div>
                  </Link>
                  <Button size="sm" shape="square" onPress={close}>
                    <PanelLeftCloseIcon />
                  </Button>
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
                  <ThemeToggle />
                </div>
              </div>
            )}
          </Dialog>
        </DialogRoot>
        <div className="flex items-center gap-1">
          <Button variant="quiet" size="sm" shape="square">
            <SearchIcon />
          </Button>
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
      </div>
    </header>
  );
};
