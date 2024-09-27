"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CommandSeparator } from "cmdk";
import {
  BookIcon,
  BoxIcon,
  CalendarIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  PaletteIcon,
  PanelRightIcon,
  PencilIcon,
  SearchIcon,
} from "lucide-react";
import { DocsSidebar } from "@/components/docs/docs-sidebar-2";
import { SearchDocs } from "@/components/docs/search-docs";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { Logo } from "@/components/main-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config";
import { docsConfig } from "@/config/docs-config";
import { Button } from "@/registry/ui/default/core/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/registry/ui/default/core/command";
import { Link } from "@/registry/ui/default/core/link";
import { ScrollArea } from "@/registry/ui/default/core/scroll-area";
import { cn } from "@/registry/ui/default/lib/cn";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="h-full before:absolute before:bottom-12 before:left-1/2 before:opacity-60 before:z-0 before:h-[350px] before:w-[700px] before:-translate-x-1/2 before:bg-[radial-gradient(at_0%_0%,#0894ff_0,rgba(0,0,0,0)_40%),radial-gradient(at_50%_30%,#ff2e54_0,rgba(0,0,0,0)_60%),radial-gradient(at_100%_0%,#ff9004_0,rgba(0,0,0,0)_40%)] before:blur-[100px] before:content-['']">
      <div className="z-30 flex h-full items-center justify-center">
        <div className="flex w-full max-w-xl flex-col">
          <h1 className="font-heading text-pretty text-xl font-semibold tracking-tighter sm:text-3xl md:text-4xl">
            Add anything to your React app.
          </h1>
          <h2 className="text-balance mt-3 text-sm text-fg-muted">
            Add components, pages, themes and much more to your React app.
          </h2>
          {/* <SearchDocs className="h-12 p-3" /> */}

          <Command className="z-50 mt-6 h-[210px] rounded-lg border dark:bg-black/40 bg-bg-muted/60 shadow-md md:min-w-[450px]">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Installation</span>
                </CommandItem>
                <CommandItem>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>CLI</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    router.push("/components/buttons/button");
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Button</span>
                </CommandItem>
              </CommandGroup>
              {/* <CommandSeparator /> */}
              {/* <CommandGroup heading="Settings">
                <CommandItem>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup> */}
            </CommandList>
          </Command>
          <div className="absolute bottom-5 left-0 right-0 text-center text-xs text-fg-muted">
            Built by <Link variant="quiet">mehdibha</Link>. The source code is
            available on <Link variant="quiet">GitHub</Link>
          </div>
          {/* <div className="flex items-center justify-center gap-2">
            {[
              {
                label: "Button",
                href: "/components/buttons/button",
              },
              {
                label: "Input",
                href: "/components/inputs/input",
              },
            ].map((link) => (
              <Button
                key={link.href}
                href={link.href}
                className="[&_svg]:size-3 h-6 text-xs font-semibold"
                prefix={<ExternalLinkIcon />}
              >
                {link.label}
              </Button>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
