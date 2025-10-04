"use no memo";
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import {
  BlocksIcon,
  BookIcon,
  BoxIcon,
  LogInIcon,
  MoonIcon,
  PaletteIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PageTree } from "fumadocs-core/server";
import type { Transition } from "motion/react";
import type { Route } from "next";

import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";
import { Tooltip } from "@dotui/registry/ui/tooltip";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { TooltipProps } from "@dotui/registry/ui/tooltip";

import { Logo } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { ThemeSwitcher } from "@/components/site-theme-selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { siteConfig } from "@/config";
import { useDebounce } from "@/hooks/use-debounce";
import { useMounted } from "@/hooks/use-mounted";
import { UserProfileMenu } from "@/modules/auth/components/user-profile-menu";
import { authClient } from "@/modules/auth/lib/client";
import { hasActive, isActive } from "@/modules/docs/utils";

export const Sidebar = ({
  className,
  items,
}: {
  className?: string;
  items: PageTree.Node[];
}) => {
  const { isCollapsed, setCollapsed } = useSidebarContext();
  const debouncedIsCollapsed = useDebounce(isCollapsed, 250);
  const isMounted = useMounted();
  const { data: session, isPending } = authClient.useSession();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setCollapsed(!isCollapsed);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCollapsed, setCollapsed]);

  const transition: Transition = {
    type: "spring",
    duration: 0.2,
    bounce: 0,
  };

  return (
    <SidebarRoot className={className}>
      <div className="relative flex items-center p-2 pl-3.5">
        <Logo
          className={cn(
            debouncedIsCollapsed &&
              "group-data-collapsed/sidebar:group-hover/sidebar:opacity-0",
          )}
        />
        <StyledTooltip
          content={
            <div className="flex items-center gap-2">
              Toggle Sidebar
              <div className="flex items-center gap-px text-[0.7rem] max-md:hidden">
                <Kbd>⌘</Kbd>
                <Kbd>B</Kbd>
              </div>
            </div>
          }
        >
          <Button
            variant="quiet"
            shape="square"
            size="sm"
            onPress={() => setCollapsed(!isCollapsed)}
            className="group-data-collapsed/sidebar:group-hover/sidebar:pointer-events-auto group-data-collapsed/sidebar:group-hover/sidebar:opacity-100 pointer-events-none absolute left-2 opacity-0"
          >
            {isCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
          </Button>
        </StyledTooltip>
        <div className="flex w-[calc(var(--sidebar-width)-calc(var(--spacing)*6))] justify-end">
          <Button
            shape="square"
            size="sm"
            onPress={() => setCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
          </Button>
        </div>
      </div>
      <div className="-mb-1 px-2 pt-0">
        <SidebarSearchButton items={items} isCollapsed={isCollapsed} />
      </div>
      <ScrollArea
        size="sm"
        style={{
          maskImage:
            "linear-gradient(transparent 2px, white 8px, white calc(100% - 8px), transparent calc(100% - 2px))",
        }}
        className="flex-1 px-2 pt-2"
        containerClassName="mt-1"
      >
        <div className="flex flex-col gap-0.5">
          {(
            [
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
            ] as const
          ).map((item) => (
            <StyledTooltip
              key={item.url}
              content={item.name}
              isDisabled={!isCollapsed}
            >
              <SidebarButton
                href={item.url}
                shape="square"
                variant="quiet"
                size="sm"
              >
                {item.icon}
                <span className="flex flex-1 flex-row items-center justify-between">
                  <span>{item.name}</span>
                </span>
              </SidebarButton>
            </StyledTooltip>
          ))}
        </div>
        <div
          className="transition-sidebar group-data-collapsed/sidebar:pointer-events-none group-data-collapsed/sidebar:opacity-0 mt-4 grid w-full min-w-0 p-2 pt-0"
          aria-hidden={isCollapsed}
        >
          <div className="transition-sidebar flex w-full min-w-0 flex-col">
            <NodeList items={items} />
          </div>
        </div>
      </ScrollArea>
      <SidebarFooter>
        <div className="group-data-collapsed/sidebar:flex-col group-data-collapsed/sidebar:justify-end flex flex-row items-start justify-between gap-1">
          <div className="group-data-collapsed/sidebar:flex-col flex items-center gap-1">
            <motion.div layout transition={transition}>
              <Button
                href={siteConfig.links.github}
                target="_blank"
                size="sm"
                shape="square"
                variant="quiet"
                aria-label="github"
              >
                <GitHubIcon />
              </Button>
            </motion.div>
          </div>
          <div className="group-data-collapsed/sidebar:flex-col flex items-center gap-1">
            <motion.div layout transition={transition}>
              <ThemeSwitcher>
                <Button
                  size="sm"
                  variant="quiet"
                  shape="square"
                  className="[&_svg]:size-[18px]"
                >
                  <SunIcon className="block dark:hidden" />
                  <MoonIcon className="hidden dark:block" />
                </Button>
              </ThemeSwitcher>
            </motion.div>
            {isMounted && !isPending && session?.user && (
              <UserProfileMenu placement="top">
                <motion.div layout transition={transition}>
                  <Button variant="quiet" shape="square" size="sm">
                    <Avatar
                      src={session?.user?.image ?? undefined}
                      fallback={session?.user?.name?.charAt(0)}
                      className="size-6"
                      shape="circle"
                    />
                  </Button>
                </motion.div>
              </UserProfileMenu>
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
              <StyledTooltip content="Login" isDisabled={!isCollapsed}>
                <SidebarButton href="/login" variant="primary" size="sm">
                  <motion.span layout transition={transition}>
                    <LogInIcon className="text-fg-on-primary!" />
                  </motion.span>
                  <span className="group-data-collapsed/sidebar:flex-1 text-center">
                    Login
                  </span>
                </SidebarButton>
              </StyledTooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarFooter>
    </SidebarRoot>
  );
};

const SidebarRoot = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { isCollapsed } = useSidebarContext();
  return (
    <aside
      className={cn("group/sidebar text-[0.8rem]", className)}
      data-collapsed={isCollapsed ? "" : undefined}
      style={
        {
          "--sidebar-width": "230px",
          "--sidebar-width-collapsed": "48px",
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "w-(--sidebar-width) transition-sidebar group-data-collapsed/sidebar:w-(--sidebar-width-collapsed) relative z-10 h-svh bg-transparent",
        )}
      />
      <div className="w-(--sidebar-width) bg-muted/10 border-r transition-sidebar group-data-collapsed/sidebar:w-(--sidebar-width-collapsed) [&_svg]:text-fg-muted fixed inset-y-0 left-0 z-10 flex h-svh flex-col overflow-hidden">
        <div className="w-(--sidebar-width) relative flex h-svh flex-1 translate-x-[-0.5px] flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </aside>
  );
};

const SidebarContext = React.createContext<{
  isCollapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isCollapsed: false,
  setCollapsed: () => {},
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = usePathname();
  const isDocsPage = params.includes("/docs");
  const [isCollapsed, setCollapsed] = React.useState(!isDocsPage);
  return (
    <SidebarContext value={{ isCollapsed, setCollapsed }}>
      {children}
    </SidebarContext>
  );
};

export const useSidebarContext = () => {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebarContext must be used within SidebarProvider");
  }
  return ctx;
};

const SidebarSearchButton = ({
  items,
  isCollapsed,
}: {
  items: PageTree.Node[];
  isCollapsed: boolean;
}) => {
  return (
    <SearchCommand items={items}>
      <StyledTooltip
        content={
          <div className="flex items-center gap-2">
            Search{" "}
            <div className="flex items-center gap-0.5 [&_kbd]:text-xs">
              <Kbd>ctrl</Kbd>
              <Kbd>K</Kbd>
            </div>
          </div>
        }
        isDisabled={!isCollapsed}
      >
        <SidebarButton variant="default" className="group/searchbtn">
          <SearchIcon />
          <div className="flex flex-1 flex-row items-center justify-between">
            <span>Search </span>
            <div className="flex items-center gap-0.5 [&_kbd]:text-xs">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </div>
          </div>
        </SidebarButton>
      </StyledTooltip>
    </SearchCommand>
  );
};

interface NodeListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: PageTree.Node[];
  level?: number;
  onSelect?: () => void;
}

export function NodeList({
  items,
  level = 0,
  onSelect,
  className,
  ...props
}: NodeListProps): React.ReactElement {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {items.map((item, i) => {
        const id = `${item.type}_${i.toString()}`;

        switch (item.type) {
          case "page":
            return (
              <PageNode
                key={item.url}
                item={item}
                level={level + 1}
                onSelect={onSelect}
              />
            );
          case "folder":
            return (
              <FolderNode
                key={id}
                item={item}
                level={level + 1}
                onSelect={onSelect}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function PageNode({
  item: { icon, url, name },
  level,
  onSelect,
}: {
  item: PageTree.Item;
  level: number;
  onSelect?: () => void;
}): React.ReactElement {
  const pathname = usePathname();
  const { isCollapsed } = React.useContext(SidebarContext);
  const active = isActive(url, pathname, false);

  if (level === 1) {
    return (
      <StyledTooltip content={name} isDisabled={!isCollapsed}>
        <SidebarButton href={url as Route} onPress={onSelect}>
          {icon}
          <span className="flex-1 text-left">{name}</span>
        </SidebarButton>
      </StyledTooltip>
    );
  }

  return (
    <Link
      target={url.startsWith("https") ? "_blank" : undefined}
      href={url as Route}
      className={cn(
        "border-bg-muted text-fg-muted hover:text-fg group block border-l py-1 pl-4 font-medium transition-colors",
        {
          "border-fg text-fg": active,
        },
      )}
      tabIndex={isCollapsed ? -1 : 0}
      onClick={onSelect}
      suppressHydrationWarning
    >
      {name}
    </Link>
  );
}

function FolderNode({
  item,
  level,
  onSelect,
}: {
  item: PageTree.Folder;
  level: number;
  onSelect?: () => void;
}): React.ReactElement {
  const defaultOpenLevel = 0;
  const pathname = usePathname();
  const active =
    item.index !== undefined && isActive(item.index.url, pathname, false);
  const childActive = React.useMemo(
    () => hasActive(item.children, pathname),
    [item.children, pathname],
  );

  const shouldExtend =
    active || childActive || (item.defaultOpen ?? defaultOpenLevel >= level);
  const [open, setOpen] = React.useState(shouldExtend);

  useOnChange(shouldExtend, (v) => {
    if (v) setOpen(v);
  });

  if (level === 1) {
    return (
      <div className="not-first:mt-8">
        <p className="font mb-2 font-medium">{item.name}</p>
        <NodeList items={item.children} level={level} onSelect={onSelect} />
      </div>
    );
  }

  return (
    <>
      <h3 className="category text-fg-muted py-1 pl-4 font-mono text-xs tracking-widest">
        {item.name}
      </h3>
      <NodeList items={item.children} level={level} onSelect={onSelect} />
    </>
  );
}

const SidebarButton = ({
  className,
  children,
  ...props
}: Omit<ButtonProps, "children"> & { children: React.ReactNode }) => {
  return (
    <Button
      shape="square"
      variant="quiet"
      size="sm"
      className={cn(
        "transition-sidebar group-data-collapsed/sidebar:w-8 relative w-full overflow-hidden text-[0.8rem] font-medium",
        className,
      )}
      {...props}
    >
      <span className="transition-sidebar group-data-collapsed/sidebar:left-2 absolute inset-2 flex w-[calc(var(--sidebar-width)-calc(var(--spacing)*8))] items-center justify-center gap-2 whitespace-nowrap [&>svg]:size-4">
        {children}
      </span>
    </Button>
  );
};

const StyledTooltip = (props: TooltipProps) => {
  return (
    <Tooltip className="px-4 py-1" placement="right" showArrow {...props} />
  );
};

const SidebarFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2 p-2">{children}</div>;
};
