"use client"

import * as ButtonPrimitives from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as DisclosurePrimitives from "react-aria-components/Disclosure"

import { useStyles } from "./styles"

// MARK: collapsibleStyles

// MARK: Separator

interface CollapsibleProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

function Collapsible({ className, ...props }: CollapsibleProps) {
  const { root } = useStyles()()
  return (
    <DisclosurePrimitives.Disclosure
      data-collapsible=""
      className={composeRenderProps(className, (c) => root({ className: c }))}
      {...props}
    />
  )
}

// MARK: Separator

interface CollapsibleTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function CollapsibleTrigger({ className, ...props }: CollapsibleTriggerProps) {
  const { trigger } = useStyles()()
  return (
    <ButtonPrimitives.Button
      slot="trigger"
      data-collapsible-trigger=""
      className={composeRenderProps(className, (c) =>
        trigger({ className: c }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface CollapsiblePanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}

function CollapsiblePanel({ className, ...props }: CollapsiblePanelProps) {
  const { panel } = useStyles()()
  return (
    <DisclosurePrimitives.DisclosurePanel
      data-collapsible-panel=""
      className={composeRenderProps(className, (c) => panel({ className: c }))}
      {...props}
    />
  )
}

// MARK: Separator

export type { CollapsiblePanelProps, CollapsibleProps, CollapsibleTriggerProps }
export { Collapsible, CollapsiblePanel, CollapsibleTrigger }
