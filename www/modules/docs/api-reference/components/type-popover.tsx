"use client";

/**
 * TypePopover - A clickable type link with a popover to browse type definitions
 * Supports nested navigation with breadcrumbs (like s2-docs)
 */

import * as React from "react";
import { ChevronRightIcon } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover,
} from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";

import type { TType } from "../types/type-ast";
import { Type, useTypeLinks } from "./type-renderer";

/* -----------------------------------------------------------------------------------------------
 * Context for nested type navigation within a popover
 * ---------------------------------------------------------------------------------------------*/

interface TypeNavigationContextValue {
  push: (name: string, type: TType) => void;
}

const TypeNavigationContext =
  React.createContext<TypeNavigationContextValue | null>(null);

/* -----------------------------------------------------------------------------------------------
 * TypeLink - Clickable type that opens a popover or navigates within one
 * ---------------------------------------------------------------------------------------------*/

interface TypeLinkProps {
  id: string;
  name: string;
  type: TType;
}

export function TypeLink({ id, name, type }: TypeLinkProps) {
  const navigationCtx = React.useContext(TypeNavigationContext);

  // If we're already inside a popover, just navigate within it
  if (navigationCtx) {
    return (
      <button
        type="button"
        onClick={() => navigationCtx.push(name, type)}
        className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-pointer font-mono"
      >
        {name}
      </button>
    );
  }

  // Otherwise, render a new popover
  return <TypePopover name={name} type={type} />;
}

/* -----------------------------------------------------------------------------------------------
 * TypePopover - Root popover component with breadcrumb navigation
 * ---------------------------------------------------------------------------------------------*/

interface BreadcrumbItem {
  id: number;
  name: string;
  type: TType;
}

interface TypePopoverProps {
  name: string;
  type: TType;
}

function TypePopover({ name, type }: TypePopoverProps) {
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([
    { id: 0, name, type },
  ]);
  const { links } = useTypeLinks();

  const currentItem = breadcrumbs.at(-1)!;

  const push = React.useCallback((name: string, type: TType) => {
    setBreadcrumbs((prev) => [...prev, { id: prev.length, name, type }]);
  }, []);

  const navigateTo = React.useCallback((index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  }, []);

  // Reset breadcrumbs when popover closes
  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setBreadcrumbs([{ id: 0, name, type }]);
      }
    },
    [name, type],
  );

  return (
    <DialogTrigger onOpenChange={handleOpenChange}>
      <Button className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-pointer font-mono outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm">
        {name}
      </Button>
      <Popover
        placement="top"
        offset={8}
        className={cn(
          "w-fit max-w-lg min-w-64",
          "rounded-lg border bg-bg shadow-xl",
          "entering:animate-in entering:fade-in entering:zoom-in-95",
          "exiting:animate-out exiting:fade-out exiting:zoom-out-95",
        )}
      >
        <OverlayArrow>
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className="block fill-bg stroke-border"
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog className="outline-none">
          <div className="p-3">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
              <nav className="mb-3 flex items-center gap-1 text-xs border-b pb-2">
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && (
                      <ChevronRightIcon className="size-3 text-fg-muted" />
                    )}
                    <button
                      type="button"
                      onClick={() => navigateTo(index)}
                      className={cn(
                        "hover:text-primary transition-colors font-mono",
                        index === breadcrumbs.length - 1
                          ? "text-fg font-medium"
                          : "text-fg-muted",
                      )}
                    >
                      {item.name}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            )}

            {/* Type content */}
            <TypeNavigationContext.Provider value={{ push }}>
              <TypePopoverContent type={currentItem.type} links={links} />
            </TypeNavigationContext.Provider>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

/* -----------------------------------------------------------------------------------------------
 * TypePopoverContent - Renders the content of the popover based on type kind
 * ---------------------------------------------------------------------------------------------*/

interface TypePopoverContentProps {
  type: TType;
  links: Record<string, TType>;
}

function TypePopoverContent({ type }: TypePopoverContentProps) {
  // Show description if available
  const description =
    "description" in type && type.description ? type.description : null;

  // For interfaces, show a table of properties
  if (type.type === "interface") {
    const properties = Object.values(type.properties || {});

    return (
      <div className="space-y-3">
        {description && (
          <p className="text-fg-muted text-sm leading-relaxed">{description}</p>
        )}

        {type.extends && type.extends.length > 0 && (
          <p className="text-xs">
            <span className="text-fg-muted">Extends: </span>
            <span className="font-mono">
              {type.extends.map((ext, i) => (
                <React.Fragment key={i}>
                  {i > 0 && ", "}
                  <Type type={ext} />
                </React.Fragment>
              ))}
            </span>
          </p>
        )}

        {properties.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-bg">
                <tr className="border-b">
                  <th className="text-left py-1 pr-3 text-fg-muted font-medium">
                    Property
                  </th>
                  <th className="text-left py-1 text-fg-muted font-medium">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {properties.map((prop, i) => (
                  <tr key={i}>
                    <td className="py-1.5 pr-3">
                      <code className="font-mono text-fg">
                        {prop.name}
                        {prop.optional && (
                          <span className="text-fg-muted">?</span>
                        )}
                      </code>
                    </td>
                    <td className="py-1.5">
                      <Type
                        type={
                          prop.type === "method" ? prop.value : prop.value
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // For type aliases, show the resolved type
  if (type.type === "alias") {
    return (
      <div className="space-y-3">
        {description && (
          <p className="text-fg-muted text-sm leading-relaxed">{description}</p>
        )}
        <div className="overflow-x-auto">
          <Type type={type.value} />
        </div>
      </div>
    );
  }

  // For other types, just render them
  return (
    <div className="space-y-3">
      {description && (
        <p className="text-fg-muted text-sm leading-relaxed">{description}</p>
      )}
      <div className="overflow-x-auto">
        <Type type={type} />
      </div>
    </div>
  );
}

