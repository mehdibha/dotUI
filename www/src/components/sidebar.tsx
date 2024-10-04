"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PanelLeftOpenIcon,
  ChevronRightIcon,
  SearchIcon,
  CommandIcon,
} from "lucide-react";
import { siteConfig } from "@/config";
import { docsConfig } from "@/config/docs-config";
import { Avatar } from "@/registry/ui/default/core/avatar";
import { Button, ButtonProps } from "@/registry/ui/default/core/button";
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/registry/ui/default/core/collapsible";
import { Kbd } from "@/registry/ui/default/core/kbd";
import { ScrollArea } from "@/registry/ui/default/core/scroll-area";
import { Tooltip, TooltipProps } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";
import { CommandMenu } from "./command-menu";
import { GitHubIcon, TwitterIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { useCommandMenuInputRef } from "@/hooks/use-focus-command-menu";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(pathname === "/");
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);
  const { focusInput } = useCommandMenuInputRef();

  // weather or not the sidebar when collapsed should free some space to the main content
  const canCollapse = ["/", "/themes"].includes(pathname);

  const toggleExpand = (value: string) => {
    setExpandedItem(expandedItem === value ? null : value);
  };

  const handleCollapse = () => {
    if (!isCollapsed) {
      setExpandedItem(null);
    }
    setIsCollapsed(!isCollapsed);
  };

  React.useEffect(() => {
    if (pathname === "/") {
      setExpandedItem(null);
      setIsCollapsed(true);
    }
  }, [pathname]);

  return (
    <aside
      className="group/sidebar hidden text-sm sm:flex"
      data-state={
        canCollapse ? (isCollapsed ? "collapsed" : "expanded") : "expanded"
      }
      style={
        {
          "--sidebar-width": "230px",
          "--sidebar-width-collapsed": "49px",
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "transition-sidebar h-svh relative z-10 w-[--sidebar-width] group-data-collapsed/sidebar:w-[--sidebar-width-collapsed] bg-transparent"
        )}
      />
      <div className="transition-sidebar h-svh fixed inset-y-0 left-0 z-10 flex w-[--sidebar-width] flex-col overflow-hidden border-r bg-bg-muted/60 group-data-collapsed/sidebar:w-[--sidebar-width-collapsed] [&_button]:font-normal [&_svg]:text-fg-muted">
        <div className="h-svh relative flex w-[--sidebar-width] flex-1 translate-x-[-0.5px] flex-col overflow-hidden">
          <div className="relative flex items-center p-2 pb-1">
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
                className="size-6 m-1 rounded-sm"
              />
              <div className="mt-[5px] font-josephin font-bold leading-normal tracking-tighter">
                {siteConfig.global.name}
              </div>
            </Link>
            <div className="flex-1" />
            {canCollapse && (
              <div className="transition-sidebar has-[button:focus-visible]:opacity-100 absolute left-[calc(var(--sidebar-width)-theme(spacing.10))] z-10 duration-75 group-data-collapsed/sidebar:left-2 group-data-collapsed/sidebar:opacity-0 group-hover/sidebar:opacity-100">
                <Button
                  className="touch:opacity-100 opacity-100 transition-all group-data-collapsed/sidebar:opacity-0 group-hover/sidebar:opacity-100 focus:group-data-collapsed/sidebar:opacity-100 focus-visible:group-data-collapsed/sidebar:opacity-100"
                  shape="square"
                  size="sm"
                  variant="default"
                  onPress={handleCollapse}
                >
                  <PanelLeftOpenIcon />
                </Button>
              </div>
            )}
          </div>
          <div className="px-2 pt-3">
            {pathname === "/" ? (
              <StyledTooltip
                content={
                  <span className="flex items-center gap-2">
                    Search
                    <Kbd>⌘K</Kbd>
                  </span>
                }
                isDisabled={!isCollapsed}
              >
                <CollapsibleButton variant="default" onPress={focusInput}>
                  <SearchIcon />
                  <span className="flex flex-1 flex-row items-center justify-between">
                    <span>Search </span>
                    <span className="flex items-center justify-center gap-0.5 text-xs text-fg-muted">
                      <CommandIcon />K
                    </span>
                  </span>
                </CollapsibleButton>
              </StyledTooltip>
            ) : (
              <StyledTooltip
                content={
                  <span className="flex items-center gap-2">
                    Search
                    <Kbd>⌘K</Kbd>
                  </span>
                }
                isDisabled={!isCollapsed}
              >
                <CommandMenu>
                  <CollapsibleButton variant="default">
                    <SearchIcon />
                    <span className="flex flex-1 flex-row items-center justify-between">
                      <span>Search </span>
                      <span className="flex items-center justify-center gap-0.5 text-xs text-fg-muted">
                        <CommandIcon />K
                      </span>
                    </span>
                  </CollapsibleButton>
                </CommandMenu>
              </StyledTooltip>
            )}
          </div>
          <ScrollArea size="sm" className="flex-1">
            <div className="transition-sidebar grid w-full min-w-0 p-2 pt-0">
              <div className="transition-sidebar flex w-full min-w-0 flex-col gap-0.5">
                {docsConfig.nav.map((elem) => {
                  if (!elem.items || elem.items.length === 0) {
                    return (
                      <StyledTooltip
                        key={elem.slug}
                        content={elem.title}
                        isDisabled={!isCollapsed}
                      >
                        <CollapsibleButton href={elem.href}>
                          {elem.icon}
                          <span className="flex-1 text-left">{elem.title}</span>
                        </CollapsibleButton>
                      </StyledTooltip>
                    );
                  }

                  return (
                    <div key={elem.slug} className="relative flex flex-col">
                      <CollapsibleRoot
                        open={expandedItem === elem.slug}
                        onOpenChange={() => toggleExpand(elem.slug)}
                      >
                        <StyledTooltip
                          content={elem.title}
                          isDisabled={!isCollapsed}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              shape="square"
                              variant="quiet"
                              size="sm"
                              className="transition-sidebar relative w-full overflow-hidden group-data-collapsed/sidebar:w-8"
                              onPress={() => {
                                if (isCollapsed) {
                                  setIsCollapsed(false);
                                }
                              }}
                            >
                              <div className="transition-sidebar [&>svg]:size-4 absolute inset-2 flex w-[calc(var(--sidebar-width)-theme(spacing.8))] items-center justify-center gap-2 whitespace-nowrap group-data-collapsed/sidebar:left-2">
                                {elem.icon}
                                <span className="flex flex-1 flex-row items-center justify-between">
                                  <span>{elem.title}</span>
                                  <ChevronRightIcon
                                    className={`transition-transform ${
                                      expandedItem === elem.slug
                                        ? "rotate-90"
                                        : ""
                                    }`}
                                  />
                                </span>
                              </div>
                            </Button>
                          </CollapsibleTrigger>
                        </StyledTooltip>
                        <CollapsibleContent asChild>
                          <ul className="space-y-2 pb-2">
                            {elem.items.map((item, index) => {
                              if ("href" in item && item.href) {
                                return (
                                  <li key={index}>
                                    <Link
                                      href={item.href}
                                      className={cn(
                                        "border-bg-bg-muted hover:text-foreground group ml-2 block border-l pl-4 text-fg-muted transition-colors",
                                        {
                                          "border-border font-medium text-fg":
                                            pathname === item.href,
                                        }
                                      )}
                                    >
                                      <span className="block duration-100 group-hover:translate-x-0.5">
                                        {item.title}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              }
                              if ("items" in item && item.items.length > 0) {
                                return (
                                  <li key={index} className="ml-2 space-y-2">
                                    <h3 className="category pl-4 font-mono text-xs tracking-widest text-fg">
                                      {item.title}
                                    </h3>
                                    <ul className="list-none">
                                      {item.items.map((subItem, subIndex) => {
                                        if (subItem.disabled) {
                                          return (
                                            <li key={subIndex}>
                                              <span
                                                className={cn(
                                                  "border-muted block cursor-not-allowed border-l py-1 pl-4 text-fg-disabled"
                                                )}
                                              >
                                                {subItem.title}
                                                {subItem.label && (
                                                  <span className="ml-2 rounded-md bg-bg-disabled px-1.5 py-0.5 text-xs leading-none text-fg-disabled">
                                                    {subItem.label}
                                                  </span>
                                                )}
                                              </span>
                                            </li>
                                          );
                                        }
                                        return (
                                          <li key={subIndex}>
                                            <Link
                                              href={subItem.href}
                                              className={cn(
                                                "border-muted hover:text-foreground group block border-l py-1 pl-4 text-fg-muted transition-colors",
                                                {
                                                  "border-fg font-medium text-fg":
                                                    pathname === subItem.href,
                                                }
                                              )}
                                            >
                                              <span className="block transition-transform duration-100 group-hover:translate-x-0.5">
                                                {subItem.title}
                                                {subItem.label && (
                                                  <span className="ml-2 rounded-md border bg-bg-muted px-1.5 py-0.5 text-xs leading-none text-fg-muted">
                                                    {subItem.label}
                                                  </span>
                                                )}
                                              </span>
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </li>
                                );
                              }
                            })}
                          </ul>
                        </CollapsibleContent>
                      </CollapsibleRoot>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
          <div className="flex flex-row items-center justify-between gap-1 p-2 group-data-collapsed/sidebar:w-[--sidebar-width-collapsed] group-data-collapsed/sidebar:flex-col group-data-collapsed/sidebar:justify-end">
            <div className="flex items-center gap-1 group-data-collapsed/sidebar:flex-col">
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
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
};

const CollapsibleWrapper = ({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled: boolean;
}) => {
  if (disabled) return children;
  return (
    <CollapsibleRoot>
      <CollapsibleTrigger asChild>{children}</CollapsibleTrigger>
      <CollapsibleContent asChild>
        <div>some content</div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
};

const CollapsibleButton = ({
  children,
  ...props
}: Omit<ButtonProps, "children"> & { children: React.ReactNode }) => {
  return (
    <Button
      shape="square"
      variant="quiet"
      size="sm"
      className="transition-sidebar relative w-full overflow-hidden group-data-collapsed/sidebar:w-8"
      {...props}
    >
      <div className="transition-sidebar [&>svg]:size-4 absolute inset-2 flex w-[calc(var(--sidebar-width)-theme(spacing.8))] items-center justify-center gap-2 whitespace-nowrap group-data-collapsed/sidebar:left-2">
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
