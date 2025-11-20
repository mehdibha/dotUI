import type React from "react";
import { ArrowUpRightIcon } from "lucide-react";
import type { MDXComponents } from "mdx/types";

import { cn } from "@dotui/registry/lib/utils";
import { Alert, type AlertProps } from "@dotui/registry/ui/alert";
import { Heading, type HeadingProps } from "@dotui/registry/ui/heading";
import { Link as NavLink } from "@dotui/registry/ui/link";
import type { LinkProps } from "@dotui/registry/ui/link";

import { CodeBlock, Pre } from "./code-block";
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "./code-block-tabs";
import type { DemoProps } from "./demo";
import { Demo } from "./demo";
import { Example } from "./example";
import { PageTabPanel, PageTabs } from "./page-tabs";

export const mdxComponents: MDXComponents = {
  h1: (props: HeadingProps) => (
    <Heading
      level={1}
      className="mt-2 scroll-m-20 font-bold text-4xl"
      {...props}
    />
  ),
  h2: (props: HeadingProps) => (
    <Heading
      level={2}
      className="mt-12 scroll-m-20 border-b pb-2 font-semibold text-2xl tracking-tight first:mt-0"
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <Heading
      level={3}
      className="mt-8 scroll-m-20 font-semibold text-xl tracking-tight"
      {...props}
    />
  ),
  h4: (props: HeadingProps) => (
    <Heading
      level={4}
      className="mt-8 scroll-m-20 font-semibold text-lg tracking-tight"
      {...props}
    />
  ),
  h5: (props: HeadingProps) => (
    <Heading
      level={5}
      className="mt-8 scroll-m-20 font-semibold text-lg tracking-tight"
      {...props}
    />
  ),
  h6: (props: HeadingProps) => (
    <Heading
      level={6}
      className="mt-8 scroll-m-20 font-semibold text-base tracking-tight"
      {...props}
    />
  ),
  PageTabs,
  PageTabPanel,
  Alert: ({ className, ...props }: AlertProps) => (
    <Alert className={cn("mt-4", className)} {...props} />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock className={cn("-mx-px mt-6", className)} {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="not-in-[pre]:rounded-sm not-in-[pre]:border not-in-[pre]:bg-card not-in-[pre]:px-1.25 not-in-[pre]:py-0.75 not-in-[pre]:font-normal not-in-[pre]:text-[0.8125rem] not-in-[pre]:text-fg-muted"
      {...props}
    />
  ),
  CodeBlockTabs: ({ defaultValue, ...props }: { defaultValue: string }) => (
    <CodeBlockTabs defaultSelectedKey={defaultValue} {...props} />
  ),
  CodeBlockTabsList,
  CodeBlockTabsTrigger: ({ value, ...props }: { value: string }) => {
    return <CodeBlockTabsTrigger id={value} {...props} />;
  },
  CodeBlockTab: ({ value, ...props }: { value: string }) => (
    <CodeBlockTab id={value} {...props} />
  ),
  Demo: (props: DemoProps) => <Demo className="not-first:mt-6" {...props} />,
  Example,
  p: ({ className, ...props }) => (
    <p
      className={cn("not-first:mt-4 text-base leading-7", className)}
      {...props}
    />
  ),
  a: Link,
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
      className={cn("mt-6 border-l-2 pl-6 italic *:text-fg-muted", className)}
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
    <thead className={cn("bg-muted", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("m-0 border-t p-0 text-sm", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border px-2 py-2 text-left font-bold sm:px-4 [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, children, ...props }) => (
    <td
      className={cn(
        "border px-2 py-2 text-left sm:px-4 [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 font-heading font-semibold text-base tracking-tight",
        className,
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
};

function Link(
  props: Omit<LinkProps, "children"> & { children: React.ReactNode },
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
