"use client"

import type * as React from "react"
import * as ButtonPrimitives from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as DisclosurePrimitives from "react-aria-components/Disclosure"

import { useStyles } from "./styles"

// MARK: collapsibleStyles

// MARK: Separator

interface CollapsibleProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

const Collapsible = ({ className, ...props }: CollapsibleProps) => {
  const { root } = useStyles()()
  return (
    <DisclosurePrimitives.Disclosure
      data-collapsible=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface CollapsibleTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

const CollapsibleTrigger = ({
  className,
  ...props
}: CollapsibleTriggerProps) => {
  const { trigger } = useStyles()()
  return (
    <ButtonPrimitives.Button
      slot="trigger"
      data-collapsible-trigger=""
      className={composeRenderProps(className, (className) =>
        trigger({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface CollapsiblePanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}

const CollapsiblePanel = ({ className, ...props }: CollapsiblePanelProps) => {
  const { panel } = useStyles()()
  return (
    <DisclosurePrimitives.DisclosurePanel
      data-collapsible-panel=""
      className={composeRenderProps(className, (className) =>
        panel({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type { CollapsiblePanelProps, CollapsibleProps, CollapsibleTriggerProps }
export { Collapsible, CollapsiblePanel, CollapsibleTrigger }
