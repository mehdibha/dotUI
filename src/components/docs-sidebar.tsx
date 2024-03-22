"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/classes";
import type { SidebarNavItem } from "@/types/nav";

export interface DocsSidebarProps {
  items: SidebarNavItem[];
}

export function DocsSidebar({ items }: DocsSidebarProps) {
  const pathname = usePathname();

  return items.length > 0 ? (
    <div className="w-full pb-10 pt-6">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-4")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {item?.items?.length > 0 && (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null;
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
}

export function DocsSidebarNavItems({ items, pathname }: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Item key={index} item={item} pathname={pathname} />
          <div className="overflow-hidden">
            {item.items.length > 0 &&
              item.href &&
              pathname &&
              pathname.includes(item.href) && (
                <div
                  className="duration animate-in fade-in slide-in-from-top-2"
                  // initial={{ opacity: 0, y: -5 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // exit={{ opacity: 0, y: -5 }}
                  // transition={{ duration: 0.1 }}
                >
                  {item.items.map((subItem, subItemIndex) => (
                    <Item
                      key={subItemIndex}
                      item={{ ...subItem }}
                      pathname={pathname}
                      className="ml-2"
                    />
                  ))}
                </div>
              )}
          </div>
        </React.Fragment>
      ))}
    </div>
  ) : null;
}

const Item = ({
  item,
  pathname,
  className,
}: {
  item: SidebarNavItem;
  pathname: string | null;
  className?: string;
}) => {
  return (
    <React.Fragment>
      {item.href && !item.disabled ? (
        <Link
          href={item.href}
          className={cn(
            "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:text-foreground",
            item.disabled && "cursor-not-allowed opacity-60",
            pathname === item.href
              ? "font-medium text-foreground"
              : "text-muted-foreground",
            item.items.length > 0 && "font-semibold text-foreground",
            className
          )}
          target={item.external ? "_blank" : ""}
          rel={item.external ? "noreferrer" : ""}
        >
          {item.title}
          {item.label && (
            <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
              {item.label}
            </span>
          )}
        </Link>
      ) : (
        <span
          className={cn(
            "flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline",
            item.disabled && "cursor-not-allowed opacity-60",
            className
          )}
        >
          {item.title}
          {item.label && (
            <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline">
              {item.label}
            </span>
          )}
        </span>
      )}
      {/* {item.items.length > 0 && } */}
      {/* <DocsSidebarNavItems items={item.items} pathname={item.href} /> */}
    </React.Fragment>
  );
};
