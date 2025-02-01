import React from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";
import { Alert, AlertProps } from "@/components/core/alert";
import { Badge, BadgeProps } from "@/components/core/badge";
import { LinkProps, Link as NavLink } from "@/components/core/link";
import { BadgePalette } from "./badge-palette";
import { Choice, Choices, ChoicesProps } from "./choices";
import { Pre } from "./code-block-mdx";
import {
  ComponentPreview,
  type ComponentPreviewProps,
} from "./component-preview";
import { ComponentSource } from "./component-source";
import { InstallTab, InstallTabs } from "./install-tabs";
import { Palette, PaletteProps } from "./palette";
import { Tabs, Tab, type TabsProps } from "./tabs";

export const mdxComponents: MDXComponents = {
  h1: createHeading(1, "font-heading mt-2 scroll-m-20 text-4xl font-bold"),
  h2: createHeading(
    2,
    "font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
  ),
  h3: createHeading(
    3,
    "font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
  ),
  h4: createHeading(
    4,
    "font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight"
  ),
  h5: createHeading(5, "mt-8 scroll-m-20 text-lg font-semibold tracking-tight"),
  h6: createHeading(
    6,
    "mt-8 scroll-m-20 text-base font-semibold tracking-tight"
  ),
  a: Link as unknown as React.ComponentType<
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  >,
  p: ({ className, ...props }) => (
    <p
      className={cn("not-first:mt-4 text-base leading-7", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn("*:text-fg-muted mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }) => (
    <img
      className={cn("mx-auto max-w-md rounded-md border", className)}
      alt={alt}
      {...props}
    />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-y-auto rounded-md [&_code]:text-xs">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn("bg-bg-muted", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("m-0 border-t p-0 text-sm", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border px-2 py-2 text-left font-bold sm:px-4 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, children, ...props }) => (
    <td
      className={cn(
        "border px-2 py-2 text-left sm:px-4 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    >
      {children}
    </td>
  ),
  // add mt-4 to all pre except when it has a parent with class install-tabs
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <Pre
      className={cn(
        "not-first:mt-4 [&_code]:grid [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-xs",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "bg-bg-muted w-full rounded-md p-1 font-mono text-sm",
        className
      )}
      {...props}
    >
      {props.children}
    </code>
  ),
  Tab,
  Tabs: (props: TabsProps) => (
    <Tabs {...props} className={cn("mt-4", props.className)} />
  ),
  Choice,
  Choices: (props: ChoicesProps) => (
    <Choices {...props} className={cn("mt-4", props.className)} />
  ),
  InstallTab,
  InstallTabs,
  ComponentSource: ({ name, ...rest }: { name: string }) => (
    <ComponentSource name={name} className="not-first:mt-4 w-full" {...rest} />
  ),
  ComponentPreview: (props: ComponentPreviewProps) => (
    <ComponentPreview containerClassName="not-first:mt-4" {...props} />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "font-heading mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }: React.ComponentProps<"div">) => (
    <div
      className="[&>h3]:step mb-12 ml-4 border-l pl-8 [counter-reset:step]"
      {...props}
    />
  ),
  Alert: ({ className, ...props }: AlertProps) => (
    <Alert className={cn("mt-4", className)} {...props} />
  ),
  Palette: ({ className, ...props }: PaletteProps) => (
    <Palette className={cn("mt-4", className)} {...props} />
  ),
  Badge: ({ className, ...props }: BadgeProps) => (
    <Badge variant="neutral" size="sm" className={cn()} {...props} />
  ),
  BadgePalette: BadgePalette,
  Link,
};

function createHeading(level: number, className?: string) {
  const Component = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return React.createElement(`h${level}`, { className, ...props }, children);
  };
  Component.displayName = `Heading${level}`;
  return Component;
}

function Link(
  props: Omit<LinkProps, "children"> & { children: React.ReactNode }
) {
  return (
    <NavLink
      target={props.href?.startsWith("/") ? "_self" : "_blank"}
      {...props}
      className="inline"
    >
      {props.children}
      {!props.href?.startsWith("/") && (
        <span className="inline-flex">
          <ArrowUpRightIcon className="size-4" />
        </span>
      )}
    </NavLink>
  );
}
