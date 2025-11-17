"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  BlocksIcon,
  BookIcon,
  BoxIcon,
  PaletteIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import {
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
  Link,
} from "react-aria-components";
import type * as PageTree from "fumadocs-core/page-tree";

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
import { useMounted } from "@/hooks/use-mounted";
import { UserProfileMenu } from "@/modules/auth/components/user-profile-menu";
import { authClient } from "@/modules/auth/lib/client";

export function DocsSidebar({ items }: { items: PageTree.Node[] }) {
  const { data: session, isPending } = authClient.useSession();

  // we call the hook here to force rerender for motion/react to work
  const { isOpen } = useSidebarContext("Sidebar");

  const isMounted = useMounted();
  const pathname = usePathname();

  return (
    <Sidebar className="[--color-sidebar:var(--color-bg)]">
      <SidebarHeader className="relative flex h-(--header-height) flex-row items-center overflow-hidden border-b pl-3.5">
        <Logo />
        <div className="absolute top-0 right-0 flex h-full w-[calc(var(--sidebar-width-icon)-1px)] items-center justify-center bg-sidebar px-2 not-group-data-expanded:opacity-0 group-hover:opacity-100 group-data-expanded:w-auto">
          <Button slot="sidebar-trigger" variant="quiet" size="sm" />
        </div>
      </SidebarHeader>

      <SidebarContent
        className=""
        style={{
          maskImage:
            "linear-gradient(transparent 2px, white 8px, white calc(100% - 8px), transparent calc(100% - 2px))",
        }}
      >
        <SidebarSection>
          <SidebarList className="**:data-[slot=button]:text-fg/85 **:[svg]:text-fg-muted/70">
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

        <AriaDisclosure isExpanded={isOpen} className="group/disclosure">
          <AriaHeading className="sr-only">Documentation</AriaHeading>
          <AriaDisclosurePanel className="h-(--disclosure-panel-height) overflow-clip opacity-0 transition-[opacity,height] duration-250 ease-drawer group-expanded/disclosure:opacity-100">
            {items.map((item) => {
              return (
                <SidebarSection key={item.$id}>
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
                                className="flex w-full border-l py-1 pl-3 text-[0.8rem] text-fg-muted transition-colors hover:text-fg data-active:border-fg data-active:text-fg"
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
          </AriaDisclosurePanel>
        </AriaDisclosure>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex justify-between">
          <Button variant="quiet" size="sm">
            <SunIcon />
          </Button>
        </div>
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
                        <motion.span
                          layout
                          transition={transition}
                          className="flex items-center gap-2"
                        >
                          <UserIcon />
                          <span>Sign in</span>
                        </motion.span>
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
