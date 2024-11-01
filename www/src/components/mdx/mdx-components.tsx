import React from "react";
import NavLink from "next/link";
import { MDXComponents } from "mdx/types";
import { Alert, AlertProps } from "@/registry/ui/default/core/alert";
import { cn } from "@/registry/ui/default/lib/cn";
import { Pre } from "./code-block";
import {
  ComponentPreview,
  type ComponentPreviewProps,
} from "./component-preview";
import { ComponentSource } from "./component-source";
import { InstallTab, InstallTabs } from "./install-tabs";
import { Tabs, Tab, type TabsProps } from "./tabs";

export const mdxComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "font-heading mt-2 scroll-m-20 text-4xl font-bold",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: Link,
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "text-base leading-7 [&:not(:first-child)]:mt-4",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "[&>*]:text-fg-muted mt-6 border-l-2 pl-6 italic",
        className
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      className={cn("mx-auto max-w-md rounded-md border", className)}
      alt={alt}
      {...props}
    />
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto rounded-md">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn("bg-bg-muted", className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-t p-0 text-sm", className)} {...props} />
  ),
  th: ({
    className,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-2 py-2 text-left font-bold sm:px-4 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({
    className,
    children,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-2 py-2 text-left sm:px-4 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </td>
  ),
  // add mt-4 to all pre except when it has a parent with class install-tabs
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <Pre className={cn("[&:not(:first-child)]:mt-4", className)} {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "bg-bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-xs",
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
  InstallTab,
  InstallTabs,
  ComponentSource: ({ name, ...rest }: { name: string }) => (
    <ComponentSource
      name={name}
      className="w-full [&:not(:first-child)]:mt-4"
      {...rest}
    />
  ),
  ComponentPreview: (props: ComponentPreviewProps) => (
    <ComponentPreview
      containerClassName="[&:not(:first-child)]:mt-4"
      {...props}
    />
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
} as MDXComponents

function Link({
  className,
  href,
  children,
  ...props
}: React.ComponentProps<"a">) {
  const classes = cn("font-medium underline underline-offset-4", className);

  if (!!href?.startsWith("/")) {
    return (
      <NavLink {...props} href={href} className={classes}>
        {children}
      </NavLink>
    );
  }

  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      {...props}
      href={href}
      className={classes}
    >
      {children}
    </a>
  );
}
