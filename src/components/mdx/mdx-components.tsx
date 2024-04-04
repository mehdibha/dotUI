import type { ComponentProps } from "react";
import NavLink from "next/link";
import { Code } from "bright";
import { CodeTabs } from "@/components/code-highlighter/code-tabs";
import { preWrapper } from "@/components/code-highlighter/pre-wrapper-extension";
import { DocsList, type DocsListProps } from "@/components/docs/docs-list";
import { cn } from "@/lib/utils/classes";
import { ComponentPreview } from "../component-preview";
import { ComponentSource } from "../component-source";
import { IconsExplorer } from "../icons-explorer";

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

export const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn("font-heading mt-2 scroll-m-20 text-4xl font-bold", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0",
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
      className={cn("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn("mt-8 scroll-m-20 text-base font-semibold tracking-tight", className)}
      {...props}
    />
  ),
  a: Link,
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-4", className)} {...props} />
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
      className={cn("mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className={cn("rounded-md", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: ComponentProps<"hr">) => <hr className="my-4 md:my-8" {...props} />,
  pre: (props: ComponentProps<"pre">) => (
    <Code
      {...props}
      theme="github-dark-dimmed"
      codeClassName="text-xs"
      extensions={[
        {
          name: "title",
          beforeHighlight: (props, annotations) => {
            if (annotations.length > 0) {
              return { ...props, title: annotations[0].query };
            }
          },
        },
        preWrapper,
      ]}
    />
  ),
  code: (props: ComponentProps<"code">) => (
    <code className="rounded border bg-muted px-1 py-0.5 font-mono text-sm" {...props} />
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
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn("bg-muted/100", className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-t p-0 even:bg-muted/50", className)} {...props} />
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
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-2 py-2 text-left sm:px-4 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  ComponentSource: ({ name, ...rest }: { name: string }) => (
    <ComponentSource name={name} className="my-2" {...rest} />
  ),
  ComponentPreview,
  IconsExplorer,
  CodeTabs,
  DocsList: (props: DocsListProps) => <DocsList {...props} className="mt-4" />,
};
