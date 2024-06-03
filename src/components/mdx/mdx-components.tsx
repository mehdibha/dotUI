import type { ComponentProps } from "react";
import React from "react";
import NavLink from "next/link";
import { InfoIcon } from "lucide-react";
import { CodeTabs } from "@/components/code-highlighter/code-tabs";
import {
  ComponentPreview,
  type ComponentPreviewProps,
} from "@/components/component-preview";
import { ComponentSource } from "@/components/component-source";
import { DocsList, type DocsListProps } from "@/components/docs/docs-list";
import { slugify } from "@/utils/string";
import { Alert } from "@/lib/components/core/default/alert";
import { CodeBlockCode, codeBlockStyles } from "@/lib/components/core/default/code-block";
import { cn } from "@/lib/utils/classes";
import { Info } from "./info";

export const Link = ({
  className,
  href,
  ref: _,
  children,
  ...props
}: ComponentProps<"a">) => {
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
};

function createHeading(level: number, className?: string) {
  const Component = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const slug = slugify(children as string);
    return React.createElement(
      `h${level}`,
      { id: slug, className, ...props },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
        }),
      ],
      children
    );
  };

  Component.displayName = `Heading${level}`;
  return Component;
}

// const Pre = (props: BrightProps) => <Code.Pre {...props} />;

export const components = {
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
  h6: createHeading(6, "mt-8 scroll-m-20 text-base font-semibold tracking-tight"),
  a: Link,
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p
      className={cn("text-base leading-7 [&:not(:first-child)]:mt-4", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ComponentProps<"ul">) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: ComponentProps<"li">) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic [&>*]:text-fg-muted", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      className={cn("mx-auto max-w-md rounded-md border", className)}
      alt={alt}
      {...props}
    />
  ),
  hr: ({ ...props }: ComponentProps<"hr">) => <hr className="my-4 md:my-8" {...props} />,
  pre: (props: ComponentProps<"pre">) => (
    <div
      className={codeBlockStyles().root({
        className: "w-full [&:not(:first-child)]:mt-4",
      })}
    >
      <CodeBlockCode lang="tsx" {...props} />
    </div>
  ),
  Code: (props: ComponentProps<"pre">) => (
    <div className={codeBlockStyles().root({ className: "mx-0.5 inline-flex" })}>
      <CodeBlockCode lang="tsx" {...props} />
    </div>
  ),
  code: (props: ComponentProps<"pre">) => (
    <code
      className={codeBlockStyles().root({
        className: "inline-flex px-2 py-0.5 text-xs text-fg-muted",
      })}
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
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step mb-12 ml-4 border-l pl-8 [counter-reset:step]"
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto rounded-md">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn("bg-bg-muted", className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-t p-0 text-sm", className)} {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-2 py-2 text-left font-bold sm:px-4 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
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
  ComponentSource: ({ name, ...rest }: { name: string }) => (
    <ComponentSource
      name={name}
      className="w-full [&:not(:first-child)]:mt-4"
      {...rest}
    />
  ),
  ComponentPreview: (props: ComponentPreviewProps) => (
    <ComponentPreview containerClassName="[&:not(:first-child)]:mt-4" {...props} />
  ),
  CodeTabs,
  DocsList: (props: DocsListProps) => <DocsList {...props} className="mt-4" />,
  ColorBadge: ({ className, children, ...props }: ComponentProps<"div">) => (
    <div
      className="inline-flex items-center space-x-1.5 rounded border bg-bg-muted px-2 py-0.5 font-mono text-sm"
      {...props}
    >
      <div className={cn("h-3.5 w-3.5 rounded-full border", className)} />
      <span>{children}</span>
      <InfoIcon size={15} />
    </div>
  ),
  Info,
  Alert,
};
