"use client";

import Link from "next/link";
import { SearchIcon } from "lucide-react";
import type * as PageTree from "fumadocs-core/page-tree";

import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { siteConfig } from "@/config";

type HeaderItem =
  | "logo"
  | "menu"
  | "mobileNav"
  | "search"
  | "github"
  | "themeSwitcher"
  | "signIn"
  | "userProfile";

export function Header({
  className,
  items,
  containerClassName,
  visibleItems = [
    "logo",
    "menu",
    "mobileNav",
    "search",
    "github",
    "themeSwitcher",
    "signIn",
    "userProfile",
  ],
}: {
  className?: string;
  containerClassName?: string;
  items: PageTree.Node[];
  visibleItems?: HeaderItem[];
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
              {(
                [
                  { label: "Docs", href: "/docs" },
                  { label: "Components", href: "/docs/components" },
                  { label: "Blocks", href: "/blocks" },
                  { label: "Styles", href: "/styles" },
                ] as const
              ).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-0.5 text-fg-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isVisible("search") && (
            <SearchCommand keyboardShortcut items={items}>
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
            <Button asChild size="sm">
              <Link
                aria-label="GitHub"
                href={siteConfig.links.github}
                target="_blank"
              >
                <GitHubIcon />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
