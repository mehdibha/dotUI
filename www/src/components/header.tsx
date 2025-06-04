"use client";

import React from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { GitHubIcon, TwitterIcon } from "./icons";
import { Logo } from "./logo";
import { SearchCommand } from "./search-command";
import { ThemeSwitcher } from "./site-theme-selector";
import { Kbd } from "./ui/kbd";

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn("bg-bg sticky top-0 z-50 w-full border-b", className)}
    >
      <div className="relative container flex h-14 max-w-screen-2xl items-center justify-between px-16">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="flex items-center gap-3 text-sm">
            {[
              { label: "Docs", href: "/docs/getting-started/introduction" },
              { label: "Components", href: "/docs/components/buttons/button" },
              { label: "Styles", href: "/styles" },
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
          <SearchCommand keyboardShortcut>
            <Button
              size="sm"
              variant="default"
              prefix={<SearchIcon />}
              suffix={
                <div className="flex items-center gap-0.5 text-xs">
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </div>
              }
              className="text-fg-muted gap-2 pr-1 pl-3"
            >
              <span className="mr-6 flex-1">Search docs...</span>
            </Button>
          </SearchCommand>
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
