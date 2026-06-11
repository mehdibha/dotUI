'use client'

import * as KeyboardPrimitive from 'react-aria-components/Keyboard'

import { useStyles } from './styles'

// MARK: kbdStyles

// MARK: KbdGroup

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
  const { group } = useStyles()()
  return <kbd data-kbd-group="" className={group({ className })} {...props} />
}

// MARK: Kbd

interface KbdProps extends React.ComponentProps<
  typeof KeyboardPrimitive.Keyboard
> {}

const Kbd = ({ className, ...props }: KbdProps) => {
  const { kbd } = useStyles()()
  return (
    <KeyboardPrimitive.Keyboard
      data-kbd=""
      className={kbd({ className })}
      {...props}
    />
  )
}

// MARK: separator

export type { KbdGroupProps, KbdProps }
export { Kbd, KbdGroup }
