import type { MDXComponents } from 'mdx/types'

import { cn } from '@/lib/utils'

export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        'mt-12 scroll-mt-24 text-xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        'mt-8 scroll-mt-24 text-lg font-semibold tracking-tight',
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
  a: ({ className, href, ...props }) => {
    const isInternal = href?.startsWith('/') ?? false
    return (
      <a
        href={href ?? '#'}
        target={isInternal ? undefined : '_blank'}
        rel={isInternal ? undefined : 'noopener noreferrer'}
        className={cn('font-medium underline underline-offset-4', className)}
        {...props}
      />
    )
  },
  ul: ({ className, ...props }) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn('mt-2 leading-7', className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn('font-semibold', className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic *:text-fg-muted', className)}
      {...props}
    />
  ),
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        'mt-6 overflow-x-auto rounded-lg border bg-card p-4 text-[0.8125rem] leading-6 [&_span]:text-(--shiki-light) dark:[&_span]:text-(--shiki-dark)',
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        'not-in-[pre]:rounded-sm not-in-[pre]:border not-in-[pre]:bg-card not-in-[pre]:px-1.5 not-in-[pre]:py-0.5 not-in-[pre]:font-mono not-in-[pre]:text-[0.8rem]',
        className,
      )}
      {...props}
    />
  ),
}
