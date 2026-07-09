import type * as React from 'react'
import { tv } from 'tailwind-variants'
const cardVariants = tv({
  slots: {
    root: [
      'group/card flex flex-col rounded-(--card-radius) border bg-card has-[>img:first-child]:pt-0 *:[img]:first:rounded-t-(--card-radius) *:[img]:last:rounded-b-(--card-radius)',
      'gap-4 py-4 text-xs/relaxed has-data-card-footer:pb-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-card-footer:pb-0',
    ],
    header: [
      'group/card-header @container/card-header grid auto-rows-min items-start rounded-t-(--card-radius) has-data-card-action:grid-cols-[1fr_auto] has-data-card-description:grid-rows-[auto_auto]',
      'gap-1 px-4 group-data-[size=sm]/card:px-3 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3',
    ],
    title: ['font-heading', 'text-base leading-snug font-medium'],
    description: ['text-fg-muted', 'text-sm'],
    action: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
    content: 'px-4 group-data-[size=sm]/card:px-3',
    footer: [
      'flex items-center rounded-b-(--card-radius)',
      'px-4 pb-4 group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:pb-3 [.border-t]:pt-4 group-data-[size=sm]/card:[.border-t]:pt-3',
    ],
  },
})

interface CardProps extends React.ComponentProps<'div'> {
  size?: 'sm' | 'default'
}

function Card({ className, size = 'default', ...props }: CardProps) {
  const { root } = cardVariants()
  return (
    <div
      data-card=""
      data-size={size}
      className={root({ className })}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.ComponentProps<'div'> {}

function CardHeader({ className, ...props }: CardHeaderProps) {
  const { header } = cardVariants()
  return (
    <div data-card-header="" className={header({ className })} {...props} />
  )
}

interface CardTitleProps extends React.ComponentProps<'div'> {}

function CardTitle({ className, ...props }: CardTitleProps) {
  const { title } = cardVariants()
  return <div data-card-title="" className={title({ className })} {...props} />
}

interface CardDescriptionProps extends React.ComponentProps<'div'> {}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  const { description } = cardVariants()
  return (
    <div
      data-card-description=""
      className={description({ className })}
      {...props}
    />
  )
}

interface CardActionProps extends React.ComponentProps<'div'> {}

function CardAction({ className, ...props }: CardActionProps) {
  const { action } = cardVariants()
  return (
    <div data-card-action="" className={action({ className })} {...props} />
  )
}

interface CardContentProps extends React.ComponentProps<'div'> {}

function CardContent({ className, ...props }: CardContentProps) {
  const { content } = cardVariants()
  return (
    <div data-card-content="" className={content({ className })} {...props} />
  )
}

interface CardFooterProps extends React.ComponentProps<'div'> {}

function CardFooter({ className, ...props }: CardFooterProps) {
  const { footer } = cardVariants()
  return (
    <div data-card-footer="" className={footer({ className })} {...props} />
  )
}

export type {
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
}
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
}
