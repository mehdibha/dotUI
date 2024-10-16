"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { PageTree } from "fumadocs-core/server";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import {
  ChevronRightIcon,
  MoonIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import { hasActive, isActive } from "@/lib/docs/utils";
import { useCommandMenuInputRef } from "@/hooks/use-focus-command-menu";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { Avatar } from "@/registry/ui/default/core/avatar";
import { Button, ButtonProps } from "@/registry/ui/default/core/button";
import {
  CollapsibleRoot,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/ui/default/core/collapsible";
import { Dialog, DialogRoot } from "@/registry/ui/default/core/dialog";
import { Kbd } from "@/registry/ui/default/core/kbd";
import { DismissButton } from "@/registry/ui/default/core/overlay";
import { ScrollArea } from "@/registry/ui/default/core/scroll-area";
import { Tooltip, TooltipProps } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";
import { siteConfig } from "@/config";
import { SearchCommand } from "./search-command";
import { ThemeToggle } from "./theme-toggle";

const MotionButton = motion.create(Button);

export const Sidebar = ({ items }: { items: PageTree.Node[] }) => {
  const pathname = usePathname();
  const shouldInitialCollapse = !!(pathname === "/" || pathname === "/themes");
  const [isCollapsed, setIsCollapsed] = React.useState(shouldInitialCollapse);

  const transition = {
    type: "spring",
    bounce: 0,
    duration: 0.25,
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SidebarRoot
      isCollapsed={isCollapsed}
      onCollapseChange={(c) => setIsCollapsed(c)}
    >
      <div className="relative flex items-center p-2 pb-1">
        <Logo />
        <div className="flex-1" />
        <SidebarToggle onPress={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
        </SidebarToggle>
      </div>
      <div className="-mb-1 px-2 pt-4">
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
        <div className="transition-sidebar grid w-full min-w-0 p-2 pt-0">
          <div className="transition-sidebar flex w-full min-w-0 flex-col">
            <NodeList items={items} />
          </div>
        </div>
      </ScrollArea>
      <SidebarFooter>
        <div className="group-data-collapsed/sidebar:flex-col flex items-center gap-1">
          <MotionButton
            href={siteConfig.links.github}
            target="_blank"
            size="sm"
            shape="square"
            variant="quiet"
            aria-label="github"
            layout
            transition={transition}
          >
            <GitHubIcon />
          </MotionButton>
          <MotionButton
            href={siteConfig.links.twitter}
            target="_blank"
            size="sm"
            shape="square"
            variant="quiet"
            aria-label="twitter"
            layout
            transition={transition}
          >
            <TwitterIcon />
          </MotionButton>
        </div>
        <ThemeToggle>
          <MotionButton
            size="sm"
            variant="quiet"
            shape="square"
            className="[&_svg]:size-[18px]"
            layout
            transition={transition}
          >
            <SunIcon className="block dark:hidden" />
            <MoonIcon className="hidden dark:block" />
          </MotionButton>
        </ThemeToggle>
      </SidebarFooter>
    </SidebarRoot>
  );
};

const SidebarRoot = ({
  children,
  isCollapsed,
  onCollapseChange,
}: {
  children: React.ReactNode;
  isCollapsed: boolean;
  onCollapseChange: (isCollapsed: boolean) => void;
}) => {
  return (
    <SidebarContext.Provider value={{ isCollapsed, onCollapseChange }}>
      <aside
        className="group/sidebar hidden text-sm sm:flex"
        data-state={isCollapsed ? "collapsed" : "expanded"}
        style={
          {
            "--sidebar-width": "230px",
            "--sidebar-width-collapsed": "49px",
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            "transition-sidebar group-data-collapsed/sidebar:w-[--sidebar-width-collapsed] relative z-10 h-svh w-[--sidebar-width] bg-transparent"
          )}
        />
        <div className="transition-sidebar bg-bg group-data-collapsed/sidebar:w-[--sidebar-width-collapsed] [&_svg]:text-fg-muted fixed inset-y-0 left-0 z-10 flex h-svh w-[--sidebar-width] flex-col overflow-hidden border-r [&_button]:font-normal">
          <div className="relative flex h-svh w-[--sidebar-width] flex-1 translate-x-[-0.5px] flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </aside>
    </SidebarContext.Provider>
  );
};

const SidebarContext = React.createContext<{
  isCollapsed: boolean;
  onCollapseChange: (isCollapsed: boolean) => void;
}>({
  isCollapsed: false,
  onCollapseChange: () => {},
});

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 rounded opacity-100 transition-[opacity,transform] duration-300 ease-out"
    >
      <Avatar
        src={siteConfig.global.logo}
        alt={siteConfig.global.name}
        width={24}
        height={24}
        loading="lazy"
        className="m-1 size-6 rounded-sm"
      />
      <div className="font-josephin mt-[5px] font-bold leading-normal tracking-tighter">
        {siteConfig.global.name}
      </div>
    </Link>
  );
};

const SidebarToggle = ({ className, ...props }: ButtonProps) => {
  return (
    <div className="transition-sidebar group-data-collapsed/sidebar:left-2 group-data-collapsed/sidebar:opacity-0 absolute left-[calc(var(--sidebar-width)-theme(spacing.10))] z-10 duration-75 group-hover/sidebar:opacity-100 has-[button:focus-visible]:opacity-100">
      <Button
        className={cn(
          "touch:opacity-100 group-data-collapsed/sidebar:opacity-0 focus:group-data-collapsed/sidebar:opacity-100 focus-visible:group-data-collapsed/sidebar:opacity-100 opacity-100 transition-all group-hover/sidebar:opacity-100",
          className
        )}
        shape="square"
        size="sm"
        variant="default"
        {...props}
      />
    </div>
  );
};

const SidebarSearchButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const pathname = usePathname();

  if (pathname === "/") {
    return <SearchCommandButton isCollapsed={isCollapsed} />;
  }

  return <SearchCommandDialog isCollapsed={isCollapsed} />;
};

const SearchCommandButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { focusInput } = useCommandMenuInputRef();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        focusInput();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [focusInput]);

  return (
    <StyledTooltip
      content={
        <div className="flex items-center gap-2">
          Search
          <Kbd>⌘K</Kbd>
        </div>
      }
      isDisabled={!isCollapsed}
    >
      <SidebarButton variant="outline" onPress={focusInput}>
        <SearchIcon />
        <div className="flex flex-1 flex-row items-center justify-between">
          <span>Search </span>
          <Kbd className="flex items-center justify-center p-1 text-xs">⌘K</Kbd>
        </div>
      </SidebarButton>
    </StyledTooltip>
  );
};

const SearchCommandDialog = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setIsOpen}>
      <StyledTooltip
        content={
          <div className="flex items-center gap-2">
            Search
            <Kbd>⌘K</Kbd>
          </div>
        }
        isDisabled={!isCollapsed}
      >
        <SidebarButton variant="outline" className="bg-bg-inverse/5">
          <SearchIcon />
          <div className="flex flex-1 flex-row items-center justify-between">
            <span>Search </span>
            <Kbd className="flex size-6 items-center justify-center p-0 text-xs">
              ⌘ K
            </Kbd>
          </div>
        </SidebarButton>
      </StyledTooltip>
      <Dialog className="!p-0" showDismissButton={false}>
        <SearchCommand
          onRunCommand={() => setIsOpen(false)}
          className="h-72 max-h-full"
        />
        <DismissButton
          variant="outline"
          shape="rectangle"
          size="sm"
          className="h-7 px-2 text-xs font-normal"
        >
          Esc
        </DismissButton>
      </Dialog>
    </DialogRoot>
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
  ...props
}: NodeListProps): React.ReactElement {
  return (
    <div {...props}>
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
  item: { icon, external = false, url, name },
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
        "border-bg-bg-muted hover:text-fg text-fg-muted group block border-l py-1 pl-4 transition-colors",
        {
          "text-fg border-fg": active,
        }
      )}
      onClick={onSelect}
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
  const { isCollapsed, onCollapseChange } = React.useContext(SidebarContext);
  const active =
    item.index !== undefined && isActive(item.index.url, pathname, false);
  const childActive = React.useMemo(
    () => hasActive(item.children, pathname),
    [item.children, pathname]
  );

  const shouldExtend =
    active || childActive || (item.defaultOpen ?? defaultOpenLevel >= level);
  const [open, setOpen] = React.useState(shouldExtend);

  useOnChange(shouldExtend, (v) => {
    if (v) setOpen(v);
  });

  if (level === 1) {
    return (
      <CollapsibleRoot open={isCollapsed ? false : open} onOpenChange={setOpen}>
        <StyledTooltip content={item.name} isDisabled={!isCollapsed}>
          <CollapsibleTrigger asChild onClick={() => onCollapseChange(false)}>
            <SidebarButton shape="square" variant="quiet" size="sm">
              {item.icon}
              <span className="flex flex-1 flex-row items-center justify-between">
                <span>{item.name}</span>
                <ChevronRightIcon
                  className={cn(
                    "transition-transform ease-in-out",
                    open && "rotate-90"
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
        "transition-sidebar group-data-collapsed/sidebar:w-8 relative w-full overflow-hidden font-normal",
        className
      )}
      {...props}
    >
      <div className="transition-sidebar group-data-collapsed/sidebar:left-2 absolute inset-2 flex w-[calc(var(--sidebar-width)-theme(spacing.8))] items-center justify-center gap-2 whitespace-nowrap [&>svg]:size-4">
        {children}
      </div>
    </Button>
  );
};

const StyledTooltip = (props: TooltipProps) => {
  return (
    <Tooltip
      delay={0}
      className="px-4 py-1"
      placement="right"
      arrow
      {...props}
    />
  );
};

const SidebarFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="group-data-collapsed/sidebar:w-[--sidebar-width-collapsed] group-data-collapsed/sidebar:flex-col group-data-collapsed/sidebar:justify-end flex flex-row items-end justify-between gap-1 p-2">
      {children}
    </div>
  );
};
