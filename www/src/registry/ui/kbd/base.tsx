"use client"

import type * as React from "react"
import * as KeyboardPrimitives from "react-aria-components/Keyboard"

import { useStyles } from "./styles"

// MARK: kbdStyles

// MARK: Separator

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
  const { group } = useStyles()()
  return <kbd data-kbd-group="" className={group({ className })} {...props} />
}

// MARK: Separator

interface KbdProps extends React.ComponentProps<
  typeof KeyboardPrimitives.Keyboard
> {}

const Kbd = ({ className, ...props }: KbdProps) => {
  const { kbd } = useStyles()()
  return (
    <KeyboardPrimitives.Keyboard
      data-kbd=""
      className={kbd({ className })}
      {...props}
    />
  )
}

// MARK: Separator

export type { KbdGroupProps, KbdProps }
export { Kbd, KbdGroup }
