"use client"

import * as ButtonPrimitives from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as DisclosurePrimitives from "react-aria-components/Disclosure"
import * as HeadingPrimitives from "react-aria-components/Heading"

import { createParamValue } from "@/lib/styles"
import { ChevronDownIcon, MinusIcon, PlusIcon } from "@/registry/icons"

import { useStyles } from "./styles"

// MARK: disclosureStyles

const useMarker = createParamValue({
  componentName: "disclosure",
  paramName: "marker",
  defaultValue: "chevron",
  values: {
    chevron: <ChevronDownIcon />,
    plus: (
      <>
        <PlusIcon className="group-expanded/disclosure:hidden" />
        <MinusIcon className="hidden group-expanded/disclosure:block" />
      </>
    ),
  },
})

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
  const { heading, button, marker } = useStyles()()
  const glyph = useMarker()
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
            <span data-disclosure-marker="" className={marker()}>
              {glyph}
            </span>
          </>
        ))}
      </ButtonPrimitives.Button>
    </HeadingPrimitives.Heading>
  )
}

// MARK: Separator

export type { DisclosurePanelProps, DisclosureProps, DisclosureTriggerProps }
export { Disclosure, DisclosurePanel, DisclosureTrigger }
