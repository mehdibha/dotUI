'use client'

import * as React from 'react'
import { ArrowDownIcon } from 'lucide-react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import { createContext } from '@/registry/lib/context'
import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: conversationStyles

const SCROLL_THRESHOLD = 24

type StickToBottom = {
  scrollRef: React.RefObject<HTMLDivElement | null>
  isAtBottom: boolean
  scrolled: boolean
  scrollToBottom: (behavior?: ScrollBehavior) => void
}

const [ConversationContext, useConversationContext] =
  createContext<StickToBottom>({
    name: 'Conversation',
    strict: false,
  })

// Keeps the scroller pinned to the bottom as content streams in, but only while
// the reader is already there — scroll up and it lets go, surfacing the
// scroll-to-bottom button. Content growth is caught with a MutationObserver
// (new messages, streamed tokens) and container resize with a ResizeObserver.
function useStickToBottom(): StickToBottom {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const stickRef = React.useRef(true)
  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const [scrolled, setScrolled] = React.useState(false)

  const measure = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    const atBottom = distance <= SCROLL_THRESHOLD
    stickRef.current = atBottom
    setIsAtBottom(atBottom)
    setScrolled(el.scrollTop > 4)
  }, [])

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const el = scrollRef.current
      if (!el) return
      el.scrollTo({ top: el.scrollHeight, behavior })
    },
    [],
  )

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
    measure()

    const onScroll = () => measure()
    el.addEventListener('scroll', onScroll, { passive: true })

    const pin = () => {
      if (stickRef.current) el.scrollTop = el.scrollHeight
      measure()
    }
    const mutationObserver = new MutationObserver(pin)
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    const resizeObserver = new ResizeObserver(pin)
    resizeObserver.observe(el)

    return () => {
      el.removeEventListener('scroll', onScroll)
      mutationObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [measure])

  return { scrollRef, isAtBottom, scrolled, scrollToBottom }
}

// MARK: Separator

interface ConversationProps extends React.ComponentProps<'div'> {}

const Conversation = ({ className, children, ...props }: ConversationProps) => {
  const stick = useStickToBottom()
  const { root, fadeTop, fadeBottom } = useStyles()()
  return (
    <ConversationContext value={stick}>
      <div
        data-conversation=""
        data-scrolled={stick.scrolled || undefined}
        data-at-bottom={stick.isAtBottom || undefined}
        className={root({ className })}
        {...props}
      >
        {children}
        <div aria-hidden className={fadeTop()} />
        <div aria-hidden className={fadeBottom()} />
      </div>
    </ConversationContext>
  )
}

// MARK: Separator

interface ConversationContentProps extends React.ComponentProps<'div'> {}

const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => {
  const ctx = useConversationContext('ConversationContent')
  const fallbackRef = React.useRef<HTMLDivElement>(null)
  const { content } = useStyles()()
  return (
    <div
      ref={ctx?.scrollRef ?? fallbackRef}
      data-conversation-content=""
      className={content({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ConversationScrollButtonProps extends React.ComponentProps<
  typeof Button
> {}

const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const ctx = useConversationContext('ConversationScrollButton')
  const { scrollButton } = useStyles()()
  if (!ctx) return null
  return (
    <Button
      data-conversation-scroll-button=""
      data-visible={!ctx.isAtBottom || undefined}
      variant="default"
      size="sm"
      isIconOnly
      aria-label="Scroll to bottom"
      onPress={() => ctx.scrollToBottom('smooth')}
      className={composeRenderProps(className, (cn) =>
        scrollButton({ className: cn }),
      )}
      {...props}
    >
      <ArrowDownIcon />
    </Button>
  )
}

// MARK: Separator

interface ConversationEmptyStateProps extends Omit<
  React.ComponentProps<'div'>,
  'title'
> {
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
}

const ConversationEmptyState = ({
  className,
  icon,
  title,
  description,
  children,
  ...props
}: ConversationEmptyStateProps) => {
  const { empty, emptyIcon, emptyTitle, emptyDescription } = useStyles()()
  return (
    <div data-conversation-empty="" className={empty({ className })} {...props}>
      {icon != null ? <div className={emptyIcon()}>{icon}</div> : null}
      {title != null ? <div className={emptyTitle()}>{title}</div> : null}
      {description != null ? (
        <div className={emptyDescription()}>{description}</div>
      ) : null}
      {children}
    </div>
  )
}

// MARK: Separator

export type {
  ConversationContentProps,
  ConversationEmptyStateProps,
  ConversationProps,
  ConversationScrollButtonProps,
}
export {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
}
