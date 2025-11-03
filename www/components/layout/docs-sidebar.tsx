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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@dotui/registry/ui/sidebar";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/site-theme-selector";
import { siteConfig } from "@/config";
import { useMounted } from "@/hooks/use-mounted";
import { UserProfileMenu } from "@/modules/auth/components/user-profile-menu";
import { authClient } from "@/modules/auth/lib/client";

export function DocsSidebar({ items }: { items: PageTree.Node[] }) {
  const { data: session, isPending } = authClient.useSession();
  const isMounted = useMounted();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="flex-row items-center border-b h-13">
        <SidebarMenu className="flex-row items-center gap-2 justify-between">
          <SidebarMenuItem className="pl-2">
            <Logo />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarTrigger size="sm" />
          </SidebarMenuItem>
          <SidebarMenuItem className="absolute left-2">
            <SidebarTrigger size="sm" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {(
              [
                {
                  icon: <BookIcon className="w-4 h-4" />,
                  name: "Docs",
                  url: "/docs/installation",
                },
                {
                  icon: <BoxIcon className="w-4 h-4" />,
                  name: "Components",
                  url: "/docs/components",
                },
                {
                  icon: <BlocksIcon className="w-4 h-4" />,
                  name: "Blocks",
                  url: "/blocks",
                },
                {
                  icon: <PaletteIcon className="w-4 h-4" />,
                  name: "Styles",
                  url: "/styles",
                },
              ] as const
            ).map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild tooltip={item.name}>
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {items.map((item) => {
          return (
            <SidebarGroup key={item.$id}>
              <SidebarGroupLabel className="text-muted-foreground font-medium">
                {item.name}
              </SidebarGroupLabel>
              <SidebarGroupContent className="pl-2">
                {item.type === "folder" && (
                  <SidebarMenu className="gap-0">
                    {item.children.map((item) => {
                      return (
                        item.type === "page" && (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                              isActive={item.url === pathname}
                              asChild
                              className="rounded-l-none text-[0.8rem] pl-3 border-l data-active:border-fg data-active:text-fg text-fg-muted data-active:bg-transparent! hover:bg-transparent hover:text-fg transition-colors"
                              size="sm"
                            >
                              <Link
                                href={item.url as Route}
                                // className="pl-2 py-2 text-fg-muted"
                              >
                                {item.name}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      );
                    })}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <motion.div
          layout
          transition={transition}
          className="flex justify-between items-center gap-2"
        >
          <Button asChild size="sm" variant="quiet" aria-label="github">
            <Link href={siteConfig.links.github} target="_blank">
              <GitHubIcon />
            </Link>
          </Button>
          <motion.div
            layout
            transition={transition}
            className="flex items-center"
          >
            <ThemeSwitcher>
              <Button size="sm" variant="quiet" className="[&_svg]:size-[18px]">
                <SunIcon className="block dark:hidden" />
                <MoonIcon className="hidden dark:block" />
              </Button>
            </ThemeSwitcher>
            {isMounted && !isPending && session?.user && (
              <UserProfileMenu placement="right">
                <Button variant="quiet" size="sm">
                  <Avatar
                    src={session.user.image ?? undefined}
                    fallback={session.user.name.charAt(0)}
                    className="size-6"
                  />
                </Button>
              </UserProfileMenu>
            )}
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {isMounted && !isPending && !session?.user && (
            <motion.div
              initial={{ opacity: 0.5, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={transition}
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="bg-primary text-fg-on-primary justify-center">
                  <Link href="/login">
                    <LogInIcon />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarFooter>
    </Sidebar>
  );
}

const transition: Transition = {
  type: "spring",
  duration: 0.2,
  bounce: 0,
};
