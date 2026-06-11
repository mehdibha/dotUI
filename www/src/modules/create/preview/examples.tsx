import { cn } from '@/registry/lib/utils'

export function Examples({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-5xl min-w-0 grid-cols-1 content-center items-start gap-12 p-12',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
