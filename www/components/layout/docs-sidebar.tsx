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
  SunIcon,
} from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { Link } from "react-aria-components";
import type * as PageTree from "fumadocs-core/page-tree";

import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Button } from "@dotui/registry/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarList,
  SidebarSection,
  SidebarSectionHeading,
  useSidebarContext,
} from "@dotui/registry/ui/sidebar";

import { Logo } from "@/components/logo";
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
        <div className="absolute right-0 top-0 bg-sidebar transition-opacity duration-150 h-full w-[calc(var(--sidebar-width-icon)-1px)] group-data-expanded:w-auto px-2 flex items-center justify-center group-hover:opacity-100 not-group-data-expanded:opacity-0 ease-drawer">
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
          <SidebarList>
            {navItems.map((item) => (
              <SidebarItem key={item.url}>
                <Button asChild size="sm" variant="quiet">
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </Button>
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
        <div className="flex group-data-expanded:flex-row flex-col justify-between group-data-exapnded:items-center items-start gap-1">
          <motion.div layout transition={transition}>
            <Button asChild size="sm" variant="quiet" aria-label="github">
              <Link href={siteConfig.links.github} target="_blank">
                <GitHubIcon />
              </Link>
            </Button>
          </motion.div>
          <div className="flex items-center group-data-expanded:flex-row flex-col justify-between group-data-exapnded:items-center gap-1">
            <motion.div layout transition={transition}>
              <ThemeSwitcher>
                <Button
                  size="sm"
                  variant="quiet"
                  className="[&_svg]:size-[18px]"
                >
                  <SunIcon className="block dark:hidden" />
                  <MoonIcon className="hidden dark:block" />
                </Button>
              </ThemeSwitcher>
            </motion.div>
            {isMounted && !isPending && session?.user && (
              <motion.div layout transition={transition} className="flex">
                <UserProfileMenu placement="right">
                  <Button variant="quiet" size="sm">
                    <Avatar
                      src={session.user.image ?? undefined}
                      fallback={session.user.name.charAt(0)}
                      className="size-6"
                    />
                  </Button>
                </UserProfileMenu>
              </motion.div>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isMounted && !isPending && !session?.user && (
            <motion.div
              initial={{ opacity: 0.5, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={transition}
            >
              <SidebarItem>
                <Button
                  asChild
                  variant="primary"
                  size="sm"
                  className="group-data-expanded:justify-center!"
                >
                  <Link href="/login">
                    <LogInIcon />
                    <span>Login</span>
                  </Link>
                </Button>
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
