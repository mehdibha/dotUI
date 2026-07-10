import { cn } from '@/registry/lib/utils'
import { Announcement } from '@/components/announcement'

/*
 * The left-aligned hero shared by the landing-style pages (/, /charts,
 * /presets): the site-wide announcement pill, a tracking-tight headline, a
 * muted supporting line, and a responsive row of actions.
 */

export function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<'section'>) {
  return (
    <section
      className={cn('container flex flex-col pt-6 sm:pt-8 md:pt-12', className)}
      {...props}
    >
      <div className="flex flex-col items-start gap-3 md:gap-4">
        <Announcement />
        {children}
      </div>
    </section>
  )
}

export function PageTitle({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'text-3xl leading-tight tracking-tighter text-balance max-lg:font-medium md:text-4xl lg:text-5xl',
        className,
      )}
      {...props}
    />
  )
}

export function PageDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'max-w-2xl text-base text-pretty text-fg-muted sm:text-lg',
        className,
      )}
      {...props}
    />
  )
}

export function PageActions({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-3',
        className,
      )}
      {...props}
    />
  )
}
