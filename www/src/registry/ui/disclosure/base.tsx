'use client'

import { ChevronDownIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as DisclosurePrimitives from 'react-aria-components/Disclosure'
import * as HeadingPrimitives from 'react-aria-components/Heading'

import { useStyles } from './styles'

// MARK: disclosureStyles

// MARK: Separator

interface DisclosureProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

function Disclosure({ className, ...props }: DisclosureProps) {
  const { root } = useStyles()()
  return (
    <DisclosurePrimitives.Disclosure
      data-disclosure=""
      className={composeRenderProps(className, (c) => root({ className: c }))}
      {...props}
    />
  )
}

// MARK: Separator

interface DisclosurePanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}

function DisclosurePanel({ className, ...props }: DisclosurePanelProps) {
  const { panel } = useStyles()()
  return (
    <DisclosurePrimitives.DisclosurePanel
      data-disclosure-panel=""
      className={composeRenderProps(className, (c) => panel({ className: c }))}
      {...props}
    >
      <div className="pb-3">{props.children}</div>
    </DisclosurePrimitives.DisclosurePanel>
  )
}

// MARK: Separator

interface DisclosureTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function DisclosureTrigger({ className, ...props }: DisclosureTriggerProps) {
  const { heading, button } = useStyles()()
  return (
    <HeadingPrimitives.Heading className={heading()}>
      <ButtonPrimitives.Button
        slot="trigger"
        data-disclosure-trigger=""
        className={composeRenderProps(className, (c) =>
          button({ className: c }),
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

export type { DisclosurePanelProps, DisclosureProps, DisclosureTriggerProps }
export { Disclosure, DisclosurePanel, DisclosureTrigger }
