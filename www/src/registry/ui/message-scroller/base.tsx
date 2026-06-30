'use client'

import * as React from 'react'
import { ArrowDownIcon } from 'lucide-react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import { createContext } from '@/registry/lib/context'
import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: messageScrollerStyles

const SCROLL_THRESHOLD = 24

type ScrollerContextValue = {
  viewportRef: React.RefObject<HTMLDivElement | null>
  isAtBottom: boolean
  scrolled: boolean
  autoScroll: boolean
  scrollToBottom: (behavior?: ScrollBehavior) => void
  scrollToMessage: (messageId: string, behavior?: ScrollBehavior) => void
  registerItem: (messageId: string, element: HTMLElement | null) => void
}

const [ScrollerContext, useScrollerContext] =
  createContext<ScrollerContextValue>({
    name: 'MessageScroller',
    strict: false,
  })

// MARK: Separator

interface MessageScrollerProviderProps {
  autoScroll?: boolean
  children?: React.ReactNode
}

// Owns the transcript scroll state. New content is caught with a
// MutationObserver (added messages, streamed tokens) and container resize with
// a ResizeObserver; while `autoScroll` is on and the reader is already at the
// bottom, the viewport stays pinned. Items register by id for jump-to-message.
const MessageScrollerProvider = ({
  autoScroll = true,
  children,
}: MessageScrollerProviderProps) => {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const itemsRef = React.useRef(new Map<string, HTMLElement>())
  const stickRef = React.useRef(true)
  const autoRef = React.useRef(autoScroll)
  autoRef.current = autoScroll

  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const [scrolled, setScrolled] = React.useState(false)

  const measure = React.useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    const atBottom = distance <= SCROLL_THRESHOLD
    stickRef.current = atBottom
    setIsAtBottom(atBottom)
    setScrolled(el.scrollTop > 4)
  }, [])

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const el = viewportRef.current
      if (!el) return
      el.scrollTo({ top: el.scrollHeight, behavior })
    },
    [],
  )

  const scrollToMessage = React.useCallback(
    (messageId: string, behavior: ScrollBehavior = 'smooth') => {
      itemsRef.current
        .get(messageId)
        ?.scrollIntoView({ behavior, block: 'start' })
    },
    [],
  )

  const registerItem = React.useCallback(
    (messageId: string, element: HTMLElement | null) => {
      if (element) itemsRef.current.set(messageId, element)
      else itemsRef.current.delete(messageId)
    },
    [],
  )

  React.useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    if (autoRef.current) el.scrollTop = el.scrollHeight
    measure()

    const onScroll = () => measure()
    el.addEventListener('scroll', onScroll, { passive: true })

    const pin = () => {
      if (autoRef.current && stickRef.current) el.scrollTop = el.scrollHeight
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

  const value = React.useMemo(
    () => ({
      viewportRef,
      isAtBottom,
      scrolled,
      autoScroll,
      scrollToBottom,
      scrollToMessage,
      registerItem,
    }),
    [
      isAtBottom,
      scrolled,
      autoScroll,
      scrollToBottom,
      scrollToMessage,
      registerItem,
    ],
  )

  return <ScrollerContext value={value}>{children}</ScrollerContext>
}

// MARK: Separator

interface MessageScrollerProps extends React.ComponentProps<'div'> {}

const MessageScroller = ({
  className,
  children,
  ...props
}: MessageScrollerProps) => {
  const ctx = useScrollerContext('MessageScroller')
  const { root, fadeTop, fadeBottom } = useStyles()()
  return (
    <div
      data-message-scroller=""
      data-scrolled={ctx?.scrolled || undefined}
      data-at-bottom={ctx?.isAtBottom || undefined}
      className={root({ className })}
      {...props}
    >
      {children}
      <div aria-hidden className={fadeTop()} />
      <div aria-hidden className={fadeBottom()} />
    </div>
  )
}

// MARK: Separator

interface MessageScrollerViewportProps extends React.ComponentProps<'div'> {}

const MessageScrollerViewport = ({
  className,
  ...props
}: MessageScrollerViewportProps) => {
  const ctx = useScrollerContext('MessageScrollerViewport')
  const fallbackRef = React.useRef<HTMLDivElement>(null)
  const { viewport } = useStyles()()
  return (
    <div
      ref={ctx?.viewportRef ?? fallbackRef}
      data-message-scroller-viewport=""
      className={viewport({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageScrollerContentProps extends React.ComponentProps<'div'> {}

const MessageScrollerContent = ({
  className,
  ...props
}: MessageScrollerContentProps) => {
  const { content } = useStyles()()
  return (
    <div
      data-message-scroller-content=""
      role="log"
      aria-live="polite"
      className={content({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageScrollerItemProps extends React.ComponentProps<'div'> {
  messageId?: string
  scrollAnchor?: boolean
}

const MessageScrollerItem = ({
  className,
  messageId,
  scrollAnchor,
  ...props
}: MessageScrollerItemProps) => {
  const ctx = useScrollerContext('MessageScrollerItem')
  const { item } = useStyles()()
  const ref = React.useCallback(
    (element: HTMLDivElement | null) => {
      if (messageId) ctx?.registerItem(messageId, element)
    },
    [ctx, messageId],
  )
  return (
    <div
      ref={ref}
      data-message-scroller-item=""
      data-message-id={messageId}
      data-scroll-anchor={scrollAnchor || undefined}
      className={item({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageScrollerButtonProps extends React.ComponentProps<
  typeof Button
> {}

const MessageScrollerButton = ({
  className,
  ...props
}: MessageScrollerButtonProps) => {
  const ctx = useScrollerContext('MessageScrollerButton')
  const { button } = useStyles()()
  if (!ctx) return null
  return (
    <Button
      data-message-scroller-button=""
      data-visible={!ctx.isAtBottom || undefined}
      variant="default"
      size="sm"
      isIconOnly
      aria-label="Scroll to bottom"
      onPress={() => ctx.scrollToBottom('smooth')}
      className={composeRenderProps(className, (cn) =>
        button({ className: cn }),
      )}
      {...props}
    >
      <ArrowDownIcon />
    </Button>
  )
}

// MARK: Separator

export type {
  MessageScrollerButtonProps,
  MessageScrollerContentProps,
  MessageScrollerItemProps,
  MessageScrollerProps,
  MessageScrollerProviderProps,
  MessageScrollerViewportProps,
}
export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
}
