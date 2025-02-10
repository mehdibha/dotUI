"use client";

import React from "react";
import Link from "next/link";
import { SearchIcon, SwatchBookIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/core/button";
import { siteConfig } from "@/config";
import { Kbd } from "./core/kbd";
import { GitHubIcon, TwitterIcon } from "./icons";
import { SearchCommand } from "./search-command";
import { ThemeColorsSelector } from "./theme-colors-selector";
import { ThemeSwitcher } from "./theme-switcher";

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn("bg-bg sticky top-0 z-50 w-full border-b", className)}
    >
      <div className="px-12.5 container relative flex h-14 max-w-screen-2xl items-center justify-between">
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
          <SearchCommand keyboardShortcut>
            <Button
              size="sm"
              variant="outline"
              prefix={<SearchIcon />}
              suffix={<Kbd className="text-xs">Ctrl+K</Kbd>}
              className="bg-bg-inverse/5 gap-2 px-3"
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

          <ThemeColorsSelector>
            <Button variant="quiet" size="sm" shape="square">
              <SwatchBookIcon />
            </Button>
          </ThemeColorsSelector>
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        className="rounded-xs"
        viewBox="0 0 300 300"
      >
        <defs>
          <clipPath id="a">
            <path d="M24 0h252c13.254 0 24 10.746 24 24v252c0 13.254-10.746 24-24 24H24c-13.254 0-24-10.746-24-24V24C0 10.746 10.746 0 24 0Zm0 0" />
          </clipPath>
          <clipPath id="b">
            <path d="M187.5 194.418h66.145v66.144H187.5Zm0 0" />
          </clipPath>
          <clipPath id="c">
            <path d="M220.57 194.418c-18.261 0-33.07 14.809-33.07 33.074 0 18.266 14.809 33.07 33.07 33.07 18.266 0 33.075-14.804 33.075-33.07 0-18.265-14.81-33.074-33.075-33.074Zm0 0" />
          </clipPath>
        </defs>
        <g clipPath="url(#a)">
          <path
            d="M-30-30h360v360H-30z"
            className="fill-[#381e1e] dark:fill-white"
          />
        </g>
        <g clipPath="url(#b)">
          <g clipPath="url(#c)">
            <path
              d="M187.5 194.418h66.145v66.144H187.5Zm0 0"
              className="fill-[#fff] dark:fill-[#381e1e]"
            />
          </g>
        </g>
      </svg>
      <div className="font-josefin group-data-collapsed/sidebar:opacity-0 mt-[5px] font-bold leading-normal tracking-tighter transition-colors">
        {siteConfig.global.name}
      </div>
    </Link>
  );
};
