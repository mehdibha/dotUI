import { ArrowUpRightIcon } from 'lucide-react'
import type { MDXComponents } from 'mdx/types'

import { cn } from '@/registry/lib/utils'
import { Alert, type AlertProps } from '@/registry/ui/alert'
import { Link } from '@/registry/ui/link'
import { CodeBlock, Pre } from '@/modules/docs/code-block'
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from '@/modules/docs/code-block-tabs'
import { ComponentsGrid } from '@/modules/docs/components-list/components-grid'
import {
  Demo,
  DemoCode,
  DemoCodePreview,
  type DemoProps,
} from '@/modules/docs/demo'
import { Example } from '@/modules/docs/example'
import { Examples, type ExamplesProps } from '@/modules/docs/examples'
import { InteractiveDemo } from '@/modules/docs/interactive-demo'
import { Reference, type ReferenceProps } from '@/modules/docs/reference'

export const mdxComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn('mt-2 scroll-m-20 text-4xl font-bold', className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        'mt-12 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        'mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        'mt-8 scroll-m-20 text-base font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        'mt-8 scroll-m-20 text-base font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        'mt-8 scroll-m-20 text-base font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn('text-[0.9375rem] leading-7 not-first:mt-4', className)}
      {...props}
    />
  ),
  a: ({ className, children, href, ...props }): React.ComponentProps<'a'> => {
    const isInternal = href?.startsWith('/') ?? false
    return (
      <Link
        href={href ?? '#'}
        target={isInternal ? '_self' : '_blank'}
        rel={isInternal ? undefined : 'noopener noreferrer'}
        className={cn('inline', className)}
        {...props}
      >
        {children}
        {!isInternal && (
          <span className="inline-flex">
            <ArrowUpRightIcon className="size-4" />
          </span>
        )}
      </Link>
    )
  },
  ul: ({ className, ...props }) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic *:text-fg-muted', className)}
      {...props}
    />
  ),
  img: ({ className, alt, src, ...props }) => (
    <img
      className={cn('mx-auto max-w-md rounded-md border', className)}
      alt={alt}
      src={src}
      {...props}
    />
  ),
  hr: (props) => <hr className="my-4 md:my-8" {...props} />,
  // Markdown tables have no JSX override otherwise, so they fall back to browser
  // defaults and overflow the capped prose column on narrow screens. Wrap in a
  // horizontal scroll container and style cells with theme tokens.
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-x-auto">
      <table
        className={cn('w-full border-collapse text-sm', className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={cn('border-b text-left', className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn('border-b last:border-0', className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        'px-3 py-2 text-left font-medium whitespace-nowrap',
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn('px-3 py-2 align-top text-fg-muted', className)}
      {...props}
    />
  ),
  pre: ({ className, 'data-raw': dataRaw, ...props }) => {
    if (dataRaw) {
      return props.children
    }
    return (
      <CodeBlock className={cn('-mx-px mt-6', className)} {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    )
  },
  code: (props) => (
    <code
      className="not-in-[pre]:rounded-sm not-in-[pre]:border not-in-[pre]:bg-card not-in-[pre]:px-1.25 not-in-[pre]:py-0.75 not-in-[pre]:text-[0.8rem] not-in-[pre]:font-normal **:[span]:text-(--shiki-light) dark:**:[span]:text-(--shiki-dark)"
      {...props}
    />
  ),
  Alert: ({ className, ...props }: AlertProps) => (
    <Alert className={cn('mt-4', className)} {...props} />
  ),
  Steps: (props) => (
    <div
      className="ml-4 border-l pl-8 [counter-reset:step] [&>h3]:step"
      {...props}
    />
  ),
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeBlockTab,
  Demo: ({ className, ...props }: DemoProps) => (
    <Demo className={cn('not-first:mt-4', className)} {...props} />
  ),
  DemoCode,
  DemoCodePreview,
  Examples: ({ className, ...props }: ExamplesProps) => (
    <Examples className={cn('not-first:mt-4', className)} {...props} />
  ),
  Example,
  InteractiveDemo: ({
    className,
    ...props
  }: React.ComponentProps<typeof InteractiveDemo>) => (
    <InteractiveDemo className={cn('not-first:mt-4', className)} {...props} />
  ),
  Reference: ({ className, ...props }: ReferenceProps) => (
    <Reference className={cn('mt-4', className)} {...props} />
  ),
  ComponentsGrid,
}
