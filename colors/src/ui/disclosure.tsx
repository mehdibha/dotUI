'use client'

import { ChevronDownIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as DisclosurePrimitives from 'react-aria-components/Disclosure'
import * as HeadingPrimitives from 'react-aria-components/Heading'
import { tv } from 'tailwind-variants'
const disclosureVariants = tv({
  slots: {
    root: 'group/disclosure w-full disabled:text-fg-disabled disabled:**:[svg]:text-fg-disabled **:data-button:[&[slot=trigger]]:w-full **:data-button:[&[slot=trigger]]:justify-between **:data-button:[&[slot=trigger]]:text-left',
    heading: 'flex',
    button: [
      'focus-reset focus-visible:focus-ring',
      'flex flex-1 cursor-interactive items-start justify-between gap-4 rounded-md py-3 text-left text-sm font-medium transition-shadow disabled:pointer-events-none',
    ],
    panel:
      'h-(--disclosure-panel-height) overflow-clip text-sm text-fg-muted opacity-0 duration-300 ease-fluid-out group-expanded/disclosure:opacity-100 motion-safe:transition-[height,opacity]',
  },
})

interface DisclosureProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

function Disclosure({ className, ...props }: DisclosureProps) {
  const { root } = disclosureVariants()
  return (
    <DisclosurePrimitives.Disclosure
      data-disclosure=""
      className={composeRenderProps(className, (c) => root({ className: c }))}
      {...props}
    />
  )
}

interface DisclosurePanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}

function DisclosurePanel({ className, ...props }: DisclosurePanelProps) {
  const { panel } = disclosureVariants()
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

interface DisclosureTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function DisclosureTrigger({ className, ...props }: DisclosureTriggerProps) {
  const { heading, button } = disclosureVariants()
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

export type { DisclosurePanelProps, DisclosureProps, DisclosureTriggerProps }
export { Disclosure, DisclosurePanel, DisclosureTrigger }
