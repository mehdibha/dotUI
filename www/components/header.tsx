"use client";

import Link from "next/link";
import { MoonIcon, SearchIcon, SunIcon } from "lucide-react";
import type { PageTree } from "fumadocs-core/server";

import { Button } from "@dotui/ui/components/button";
import { Kbd } from "@dotui/ui/components/kbd";
import { cn } from "@dotui/ui/lib/utils";

import { siteConfig } from "@/config";
import { useMounted } from "@/hooks/use-mounted";
import { UserProfileMenu } from "@/modules/auth/components/user-profile-menu";
import { authClient } from "@/modules/auth/lib/client";
import { GitHubIcon } from "./icons";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { SearchCommand } from "./search-command";
import { ThemeSwitcher } from "./site-theme-selector";

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
      className={cn("sticky top-0 z-50 w-full border-b bg-bg", className)}
    >
      <div
        className={cn(
          "relative container flex h-14 items-center justify-between",
          containerClassName,
        )}
      >
        <div className="flex items-center gap-3 md:gap-6">
          <MobileNav items={items} />
          {/* <Logo className="md:hidden" /> */}
          <Logo className="max-md:hidden" />
          <div className="flex items-center gap-3 text-sm max-md:hidden">
            {[
              { label: "Docs", href: "/docs/introduction" },
              { label: "Components", href: "/docs/components/button" },
              { label: "Blocks", href: "/blocks/featured" },
              { label: "Styles", href: "/styles" },
            ].map((item) => (
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
