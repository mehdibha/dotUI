"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  BlocksIcon,
  BookIcon,
  BoxIcon,
  LogInIcon,
  MoonIcon,
  PaletteIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { Link } from "react-aria-components";
import type * as PageTree from "fumadocs-core/page-tree";

import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarList,
  SidebarSection,
  SidebarSectionHeading,
  SidebarTooltip,
  useSidebarContext,
} from "@dotui/registry/ui/sidebar";

import { Logo } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { ThemeSwitcher } from "@/components/site-theme-selector";
import { siteConfig } from "@/config";
import { useMounted } from "@/hooks/use-mounted";
import { UserProfileMenu } from "@/modules/auth/components/user-profile-menu";
import { authClient } from "@/modules/auth/lib/client";

export function DocsSidebar({ items }: { items: PageTree.Node[] }) {
  const { data: session, isPending } = authClient.useSession();

  // we call the hook here to force rerender for motion/react to work
  useSidebarContext("Sidebar");

  const isMounted = useMounted();
  const pathname = usePathname();

  return (
    <Sidebar className="[--color-sidebar:var(--color-bg)]">
      <SidebarHeader className="relative flex flex-row items-center border-b pl-3.5 h-13 overflow-hidden">
        <Logo />
        <div className="absolute right-0 top-0 bg-sidebar h-full w-[calc(var(--sidebar-width-icon)-1px)] group-data-expanded:w-auto px-2 flex items-center justify-center group-hover:opacity-100 not-group-data-expanded:opacity-0">
          <Button slot="sidebar-trigger" variant="quiet" size="sm" />
        </div>
      </SidebarHeader>

      <SidebarContent
        style={{
          maskImage:
            "linear-gradient(transparent 2px, white 8px, white calc(100% - 8px), transparent calc(100% - 2px))",
        }}
      >
        <SidebarSection>
          <SidebarList className="**:[svg]:text-fg-muted/70 **:data-[slot=button]:text-fg/85">
            <SearchCommand items={items} keyboardShortcut>
              <SidebarItem>
                <SidebarTooltip content="Search">
                  <Button
                    aria-label="Search"
                    variant="default"
                    size="sm"
                    className="text-fg-muted"
                  >
                    <SearchIcon />
                    <span className="flex-1 text-left">Search...</span>
                    <Kbd>⌘K</Kbd>
                  </Button>
                </SidebarTooltip>
              </SidebarItem>
            </SearchCommand>
            {navItems.map((item) => (
              <SidebarItem key={item.url}>
                <SidebarTooltip content={item.name}>
                  <Button asChild size="sm" variant="quiet">
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                </SidebarTooltip>
              </SidebarItem>
            ))}
          </SidebarList>
        </SidebarSection>

        {items.map((item) => {
          return (
            <SidebarSection
              key={item.$id}
              className="opacity-0 group-data-expanded:opacity-100 transition-opacity duration-150"
            >
              <SidebarSectionHeading className="text-fg">
                {item.name}
              </SidebarSectionHeading>
              {item.type === "folder" && (
                <SidebarList className="gap-0 pl-2">
                  {item.children.map((item) => {
                    return (
                      item.type === "page" && (
                        <SidebarItem key={item.url}>
                          <Link
                            href={item.url as Route}
                            data-active={item.url === pathname || undefined}
                            className="text-[0.8rem] w-full flex pl-3 py-1 border-l text-fg-muted hover:text-fg transition-colors data-active:text-fg data-active:border-fg"
                          >
                            {item.name}
                          </Link>
                        </SidebarItem>
                      )
                    );
                  })}
                </SidebarList>
              )}
            </SidebarSection>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <AnimatePresence>
          {isMounted && !isPending && session?.user && (
            <motion.div layout transition={transition} className="flex">
              <UserProfileMenu
                placement="right"
                size="sm"
                className="*:data-[slot=avatar]:size-6"
              />
            </motion.div>
          )}
          {isMounted && !isPending && !session?.user && (
            <motion.div
              initial={{ opacity: 0.5, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={transition}
            >
              <SidebarItem asChild>
                <div>
                  <SidebarTooltip content="Sign in">
                    <Button
                      asChild
                      size="sm"
                      className="group-data-expanded:justify-center!"
                    >
                      <Link href="/login">
                        <UserIcon />
                        <span>Sign in</span>
                      </Link>
                    </Button>
                  </SidebarTooltip>
                </div>
              </SidebarItem>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarFooter>
    </Sidebar>
  );
}

const navItems = [
  {
    icon: <BookIcon />,
    name: "Docs",
    url: "/docs/installation",
  },
  {
    icon: <BoxIcon />,
    name: "Components",
    url: "/docs/components",
  },
  {
    icon: <BlocksIcon />,
    name: "Blocks",
    url: "/blocks",
  },
  {
    icon: <PaletteIcon />,
    name: "Styles",
    url: "/styles",
  },
] as { icon: React.ReactNode; name: string; url: Route }[];

const transition: Transition = {
  type: "spring",
  duration: 0.2,
  bounce: 0,
};
