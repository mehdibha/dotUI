import { cn } from '@/registry/lib/utils'

export function PageLayout({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('', className)} {...props} />
}

export function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'leading-tighter max-w-2xl text-3xl font-semibold text-balance xl:text-3xl',
        className,
      )}
      {...props}
    />
  )
}

export function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'sm:text-md mt-1 max-w-3xl text-base text-balance text-fg-muted',
        className,
      )}
      {...props}
    />
  )
}
