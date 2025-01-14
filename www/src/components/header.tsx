"use client";

import React from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { Avatar } from "@/components/core/avatar";
import { Button } from "@/components/core/button";
import { DialogRoot, Dialog } from "@/components/core/dialog";
import { siteConfig } from "@/config";
import { Kbd } from "./core/kbd";
import { GitHubIcon, TwitterIcon } from "./icons";
import { SearchCommand } from "./search-command";
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  return (
    <header className="bg-bg sticky top-0 z-50 w-full border-b">
      {/* <div className="container max-w-screen-2xl relative flex h-14  items-center justify-between"> */}
      <div className="container relative flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="flex items-center gap-3 text-sm">
            {[
              { label: "Docs", href: "/docs/getting-started/introduction" },
              { label: "Components", href: "/docs/components/buttons/button" },
              { label: "Themes", href: "/themes" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-fg-muted hover:text-fg px-0.5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SearchDocs>
            <Button
              size="sm"
              variant="outline"
              prefix={<SearchIcon />}
              suffix={<Kbd className="text-xs">Ctrl+K</Kbd>}
              className="bg-bg-inverse/5 gap-2 px-3"
            >
              <span className="mr-6 flex-1">Search docs...</span>
            </Button>
          </SearchDocs>
          <Button
            href={siteConfig.links.github}
            target="_blank"
            variant="quiet"
            size="sm"
            shape="square"
          >
            <GitHubIcon />
          </Button>
          <Button
            href={siteConfig.links.twitter}
            target="_blank"
            variant="quiet"
            size="sm"
            shape="square"
          >
            <TwitterIcon />
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

const Logo = () => {
  return (
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
  );
};

const SearchDocs = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
      <Dialog className="p-0!">
        <SearchCommand
          onRunCommand={() => setIsOpen(false)}
          className="h-72 max-h-full rounded-lg"
        />
        <Button
          slot="close"
          variant="outline"
          shape="rectangle"
          size="sm"
          className="h-7 px-2 text-xs font-normal"
        >
          Esc
        </Button>
      </Dialog>
    </DialogRoot>
  );
};
