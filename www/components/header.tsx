"use client";

import Link from "next/link";
import { SearchIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Kbd } from "@dotui/ui/components/kbd";
import { cn } from "@dotui/ui/lib/utils";

import { siteConfig } from "@/config";
import { useMounted } from "@/hooks/use-mounted";
import { UserProfileMenu } from "@/modules/auth/components/user-profile-menu";
import { authClient } from "@/modules/auth/lib/client";
import { GitHubIcon, TwitterIcon } from "./icons";
import { Logo } from "./logo";
import { SearchCommand } from "./search-command";
import { ThemeSwitcher } from "./site-theme-selector";

export function Header({ className }: { className?: string }) {
  const { data: session, isPending } = authClient.useSession();
  const isMounted = useMounted();

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b bg-bg", className)}
    >
      <div className="relative container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="flex items-center gap-3 text-sm">
            {[
              { label: "Docs", href: "/docs/getting-started/introduction" },
              { label: "Components", href: "/docs/components/buttons/button" },
              { label: "Blocks", href: "/blocks" },
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
            <SearchCommand keyboardShortcut>
              <Button
                variant="default"
                prefix={<SearchIcon />}
                suffix={
                  <div className="flex items-center gap-0.5 text-xs">
                    <Kbd>Ctrl</Kbd>
                    <Kbd>K</Kbd>
                  </div>
                }
                size="sm"
                className="gap-2 pr-1 pl-3 text-fg-muted"
              >
                <span className="mr-6 flex-1">Search docs...</span>
              </Button>
            </SearchCommand>
            {session ? (
              <UserProfileMenu />
            ) : (
              <>
                <Button
                  href={siteConfig.links.github}
                  target="_blank"
                  variant="quiet"
                  shape="square"
                >
                  <GitHubIcon />
                </Button>
                <Button
                  href={siteConfig.links.twitter}
                  target="_blank"
                  variant="quiet"
                  shape="square"
                  size="sm"
                >
                  <TwitterIcon />
                </Button>
                <ThemeSwitcher />
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
