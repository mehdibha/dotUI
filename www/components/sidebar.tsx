"use no memo";
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import {
  ChevronRightIcon,
  MoonIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import { motion } from "motion/react";
import type { PageTree } from "fumadocs-core/server";
import type { Transition } from "motion/react";

import { Button } from "@dotui/ui/components/button";
import { Kbd } from "@dotui/ui/components/kbd";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";
import type { ButtonProps } from "@dotui/ui/components/button";
import type { TooltipProps } from "@dotui/ui/components/tooltip";

import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/collapsible";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { ScrollArea } from "@/components/scroll-area";
import { siteConfig } from "@/config";
import { hasActive, isActive } from "@/modules/docs/utils";
import { Logo } from "./logo";
import { SearchCommand } from "./search-command";
import { ThemeSwitcher } from "./site-theme-selector";

export const Sidebar = ({
  className,
  items,
}: {
  className?: string;
  items: PageTree.Node[];
}) => {
  const { isCollapsed, setCollapsed } = useSidebarContext();

  const transition: Transition = {
    type: "spring",
    duration: 0.2,
    bounce: 0,
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setCollapsed]);

  return (
    <SidebarRoot className={className}>
      <div className="relative flex items-center p-3.5">
        <Logo />
      </div>
      <div className="-mb-1 px-2 pt-0">
        <SidebarSearchButton isCollapsed={isCollapsed} />
      </div>
      <ScrollArea
        size="sm"
        style={{
          maskImage:
            "linear-gradient(transparent 2px, white 16px, white calc(100% - 16px), transparent calc(100% - 2px))",
        }}
        className="flex-1 pt-4"
      >
        <div className="grid w-full min-w-0 p-2 pt-0 transition-sidebar">
          <div className="flex w-full min-w-0 flex-col transition-sidebar">
            <NodeList items={items} />
          </div>
        </div>
      </ScrollArea>
      <SidebarFooter>
        <div className="flex items-center gap-1 group-data-collapsed/sidebar:flex-col">
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
          <motion.div layout transition={transition}>
            <Button
              href={siteConfig.links.twitter}
              target="_blank"
              size="sm"
              shape="square"
              variant="quiet"
              aria-label="twitter"
            >
              <TwitterIcon />
            </Button>
          </motion.div>
        </div>
        <div className="flex items-center gap-1 group-data-collapsed/sidebar:flex-col">
          <ThemeSwitcher>
            <motion.div layout transition={transition}>
              <Button
                size="sm"
                variant="quiet"
                shape="square"
                className="[&_svg]:size-[18px]"
              >
                <SunIcon className="block dark:hidden" />
                <MoonIcon className="hidden dark:block" />
              </Button>
            </motion.div>
          </ThemeSwitcher>
          <StyledTooltip
            content={
              <div className="flex items-center gap-2">
                Toggle Sidebar
                <div className="flex items-center gap-0.5">
                  <Kbd>ctrl</Kbd>
                  <Kbd>B</Kbd>
                </div>
              </div>
            }
            placement="right"
          >
            <motion.div layout transition={transition}>
              <Button
                shape="square"
                size="sm"
                variant="default"
                onPress={() => setCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
              </Button>
            </motion.div>
          </StyledTooltip>
        </div>
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
          "--sidebar-width-collapsed": "49px",
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "relative z-10 h-svh w-(--sidebar-width) bg-transparent transition-sidebar group-data-collapsed/sidebar:w-(--sidebar-width-collapsed)",
        )}
      />
      <div className="fixed inset-y-0 left-0 z-10 flex h-svh w-(--sidebar-width) flex-col overflow-hidden border-r bg-bg transition-sidebar group-data-collapsed/sidebar:w-(--sidebar-width-collapsed) [&_svg]:text-fg-muted">
        <div className="relative flex h-svh w-(--sidebar-width) flex-1 translate-x-[-0.5px] flex-col overflow-hidden">
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
  const [isCollapsed, setCollapsed] = React.useState(true);
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

const SidebarSearchButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <SearchCommand keyboardShortcut>
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
        <SidebarButton variant="default">
          <SearchIcon />
          <div className="flex flex-1 flex-row items-center justify-between">
            <span>Search </span>
            <div className="flex items-center gap-0.5 [&_kbd]:text-xs">
              <Kbd>Ctrl</Kbd>
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
    <div className={cn("flex flex-col gap-0.5", className)} {...props}>
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
        <SidebarButton href={url} onPress={onSelect}>
          {icon}
          <span className="flex-1 text-left">{name}</span>
        </SidebarButton>
      </StyledTooltip>
    );
  }

  return (
    <Link
      href={url}
      className={cn(
        "border-bg-bg-muted font-medium group block border-l py-1 pl-4 text-fg transition-colors hover:text-fg-muted",
        {
          "border-fg text-fg": active,
        },
      )}
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
  const { isCollapsed, setCollapsed } = useSidebarContext();
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
      <CollapsibleRoot open={isCollapsed ? false : open} className="contents">
        <StyledTooltip content={item.name} isDisabled={!isCollapsed}>
          <CollapsibleTrigger asChild>
            <SidebarButton
              shape="square"
              variant="quiet"
              size="sm"
              onPress={() => {
                if (!isCollapsed) {
                  setOpen(!open);
                  return;
                }
                setOpen(true);
                setCollapsed(false);
              }}
            >
              {item.icon}
              <span className="flex flex-1 flex-row items-center justify-between">
                <span>{item.name}</span>
                <ChevronRightIcon
                  className={cn(
                    "transition-transform ease-in-out",
                    open && "rotate-90",
                  )}
                />
              </span>
            </SidebarButton>
          </CollapsibleTrigger>
        </StyledTooltip>
        <CollapsibleContent className="pb-2 pl-4">
          <NodeList items={item.children} level={level} onSelect={onSelect} />
        </CollapsibleContent>
      </CollapsibleRoot>
    );
  }

  return (
    <>
      <h3 className="category py-1 pl-4 font-mono text-xs tracking-widest text-fg-muted">
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
        "relative font-medium w-full overflow-hidden text-[0.8rem] transition-sidebar group-data-collapsed/sidebar:w-8 hover:bg-bg-inverse/10",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-2 flex w-[calc(var(--sidebar-width)-calc(var(--spacing)*8))] items-center justify-center gap-2 whitespace-nowrap transition-sidebar group-data-collapsed/sidebar:left-2 [&>svg]:size-4">
        {children}
      </span>
    </Button>
  );
};

const StyledTooltip = (props: TooltipProps) => {
  return (
    <Tooltip
      delay={0}
      className="px-4 py-1"
      placement="right"
      showArrow
      {...props}
    />
  );
};

const SidebarFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row items-end justify-between gap-1 p-2 group-data-collapsed/sidebar:w-(--sidebar-width-collapsed) group-data-collapsed/sidebar:flex-col group-data-collapsed/sidebar:justify-end">
      {children}
    </div>
  );
};
