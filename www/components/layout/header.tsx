"use client";

import Link from "next/link";
import { SearchIcon } from "lucide-react";
import type * as PageTree from "fumadocs-core/page-tree";

import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { cn } from "@dotui/registry/lib/utils";
import { Button, LinkButton } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { navItems, siteConfig } from "@/config/site";

import { SiteThemeToggle } from "../site-theme-toggle";

type HeaderItem =
  | "logo"
  | "menu"
  | "mobileNav"
  | "search"
  | "github"
  | "themeToggle";

export function Header({
  className,
  items,
  containerClassName,
  searchKeyboardShortcut = false,
  visibleItems = null,
}: {
  className?: string;
  containerClassName?: string;
  items: PageTree.Node[];
  visibleItems?: HeaderItem[] | null;
  searchKeyboardShortcut?: boolean;
}) {
  const isVisible = (item: HeaderItem) => {
    if (!visibleItems) return true;
    return visibleItems.includes(item);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-(--header-height) w-full border-b bg-bg",
        className,
      )}
    >
      <div
        className={cn(
          "container relative flex h-full items-center justify-between",
          containerClassName,
        )}
      >
        <div className="flex items-center gap-3 md:gap-6">
          {isVisible("mobileNav") && <MobileNav items={items} />}
          {isVisible("logo") && <Logo className="max-md:hidden" />}
          {isVisible("menu") && (
            <nav className="flex items-center gap-3 text-sm max-md:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className="px-0.5 text-fg-muted transition-colors hover:text-fg"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isVisible("search") && (
            <SearchCommand
              keyboardShortcut={searchKeyboardShortcut}
              items={items}
            >
              <Button
                variant="default"
                size="sm"
                className="gap-2 pr-1 pl-3 max-md:size-8 max-md:px-0 md:text-fg-muted"
              >
                <SearchIcon className="md:hidden" />
                <span className="mr-6 flex-1 max-md:hidden">
                  Search docs...
                </span>
                <Kbd className="max-md:hidden">⌘ K</Kbd>
              </Button>
            </SearchCommand>
          )}
          {isVisible("github") && (
            <LinkButton
              aria-label="GitHub"
              href={siteConfig.links.github}
              target="_blank"
              size="sm"
            >
              <GitHubIcon />
            </LinkButton>
          )}
          {isVisible("themeToggle") && <SiteThemeToggle size="sm" />}
        </div>
      </div>
    </header>
  );
}
