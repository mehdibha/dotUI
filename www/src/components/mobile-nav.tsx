"use client";

import Link from "next/link";
import type { PageTree } from "fumadocs-core/server";
import { AlignLeftIcon, PanelLeftCloseIcon, SearchIcon } from "lucide-react";
import { Avatar } from "@/components/core/avatar";
import { Button } from "@/components/core/button";
import { Dialog, DialogRoot } from "@/components/core/dialog";
import { ScrollArea } from "@/components/core/scroll-area";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { siteConfig } from "@/config";
import { NodeList } from "./sidebar";
import { ThemeSwitcher } from "./theme-switcher";

export const MobileNav = ({ items }: { items: PageTree.Node[] }) => {
  return (
    <header className="bg-bg sticky top-0 z-50 block border-b backdrop-blur-md sm:hidden">
      <div className="max-w-(--breakpoint-2xl) container flex h-14 w-full items-center justify-between">
        <DialogRoot>
          <Button variant="quiet" size="sm" shape="square">
            <AlignLeftIcon />
          </Button>
          <Dialog
            type="drawer"
            drawerProps={{
              placement: "left",
            }}
            className="p-0 w-60 flex flex-col"
          >
            {({ close }) => (
              <div className="z-50 flex h-full flex-col">
                <div className="flex items-center justify-between p-2">
                  <Link
                    href="/"
                    className="flex items-center gap-2 rounded opacity-100 transition-[opacity,transform] duration-300 ease-out"
                  >
                    <Avatar
                      src={siteConfig.global.logo}
                      alt={siteConfig.global.name}
                      width={24}
                      height={24}
                      loading="lazy"
                      className="m-1 size-6 rounded-sm"
                    />
                    <div className="font-josefin group-data-collapsed/sidebar:opacity-0 mt-[5px] font-bold leading-normal tracking-tighter transition-colors">
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
                  <ThemeSwitcher />
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
