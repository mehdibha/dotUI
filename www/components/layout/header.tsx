"use client";

import Link from "next/link";
import { MoonIcon, SearchIcon, SunIcon } from "lucide-react";
import type { PageTree } from "fumadocs-core/server";

import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { ThemeSwitcher } from "@/components/site-theme-selector";
import { siteConfig } from "@/config";
import { useMounted } from "@/hooks/use-mounted";
import { UserProfileMenu } from "@/modules/auth/components/user-profile-menu";
import { authClient } from "@/modules/auth/lib/client";

export function Header({
  className,
  items,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
  items: PageTree.Node[];
}) {
  const { data: session, isPending } = authClient.useSession();
  const isMounted = useMounted();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b bg-bg lg:px-8",
        className,
      )}
    >
      <div
        className={cn(
          "relative container flex h-14 items-center justify-between",
          containerClassName,
        )}
      >
        <div className="flex items-center gap-3 md:gap-6">
          <MobileNav items={items} />
          <Logo className="max-md:hidden" />
          <div className="flex items-center gap-3 text-sm max-md:hidden">
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
          </div>
        </div>
        {isMounted && !isPending && (
          <div className="flex animate-in items-center gap-2 fade-in">
            <SearchCommand keyboardShortcut items={items}>
              <Button
                variant="default"
                suffix={
                  <div className="flex items-center gap-px text-[0.7rem] max-md:hidden">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </div>
                }
                size="sm"
                className="gap-2 pr-1 pl-3 max-md:size-8 max-md:px-0 md:text-fg-muted"
              >
                <SearchIcon className="md:hidden" />
                <span className="mr-6 flex-1 max-md:hidden">
                  Search docs...
                </span>
              </Button>
            </SearchCommand>
            <Button
              href={siteConfig.links.github}
              target="_blank"
              size="sm"
              shape="square"
            >
              <GitHubIcon />
            </Button>
            {session ? (
              <UserProfileMenu />
            ) : (
              <>
                <ThemeSwitcher>
                  <Button size="sm" shape="square">
                    <SunIcon className="block dark:hidden" />
                    <MoonIcon className="hidden dark:block" />
                  </Button>
                </ThemeSwitcher>
                <Button variant="primary" href="/login" size="sm">
                  Sign in
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
