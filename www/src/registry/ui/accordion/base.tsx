'use client'

import { ChevronDownIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as DisclosurePrimitives from 'react-aria-components/Disclosure'
import * as DisclosureGroupPrimitives from 'react-aria-components/DisclosureGroup'
import * as HeadingPrimitives from 'react-aria-components/Heading'

import { useStyles } from './styles'

// MARK: accordionStyles

// MARK: Separator

interface AccordionProps extends React.ComponentProps<
  typeof DisclosureGroupPrimitives.DisclosureGroup
> {}

function Accordion({ className, ...props }: AccordionProps) {
  const { root } = useStyles()()
  return (
    <DisclosureGroupPrimitives.DisclosureGroup
      data-accordion=""
      className={composeRenderProps(className, (c) => root({ className: c }))}
      {...props}
    />
  )
}

// MARK: Separator

interface AccordionItemProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

function AccordionItem({ className, ...props }: AccordionItemProps) {
  const { item } = useStyles()()
  return (
    <DisclosurePrimitives.Disclosure
      data-accordion-item=""
      className={composeRenderProps(className, (c) => item({ className: c }))}
      {...props}
    />
  )
}

// MARK: Separator

interface AccordionTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function AccordionTrigger({ className, ...props }: AccordionTriggerProps) {
  const { heading, trigger } = useStyles()()
  return (
    <HeadingPrimitives.Heading className={heading()}>
      <ButtonPrimitives.Button
        slot="trigger"
        data-accordion-trigger=""
        className={composeRenderProps(className, (c) =>
          trigger({ className: c }),
        )}
        {...props}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            {children}
            <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-fg-muted transition-transform duration-200" />
          </>
        ))}
      </ButtonPrimitives.Button>
    </HeadingPrimitives.Heading>
  )
}

// MARK: Separator

interface AccordionPanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}

function AccordionPanel({ className, ...props }: AccordionPanelProps) {
  const { panel } = useStyles()()
  return (
    <DisclosurePrimitives.DisclosurePanel
      data-accordion-panel=""
      className={composeRenderProps(className, (c) => panel({ className: c }))}
      {...props}
    >
      <div className="pb-3">{props.children}</div>
    </DisclosurePrimitives.DisclosurePanel>
  )
}

// MARK: Separator

export type {
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
  AccordionTriggerProps,
}
export { Accordion, AccordionItem, AccordionPanel, AccordionTrigger }
