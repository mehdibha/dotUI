'use client'

import * as KeyboardPrimitive from 'react-aria-components/Keyboard'
import { tv } from 'tailwind-variants'
const kbdVariants = tv({
  slots: {
    group: 'inline-flex items-center gap-1',
    kbd: [
      'pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-fg-muted select-none',
      '**:[svg]:not-with-[size]:size-3',
    ],
  },
})

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
  const { group } = kbdVariants()
  return <kbd data-kbd-group="" className={group({ className })} {...props} />
}

interface KbdProps extends React.ComponentProps<
  typeof KeyboardPrimitive.Keyboard
> {}

const Kbd = ({ className, ...props }: KbdProps) => {
  const { kbd } = kbdVariants()
  return (
    <KeyboardPrimitive.Keyboard
      data-kbd=""
      className={kbd({ className })}
      {...props}
    />
  )
}

export type { KbdGroupProps, KbdProps }
export { Kbd, KbdGroup }
