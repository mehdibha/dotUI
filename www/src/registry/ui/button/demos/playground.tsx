'use client'

import { Button, type ButtonProps } from '@/registry/ui/button'

export default function Demo({
  children = 'Button',
  variant = 'default',
  size = 'md',
  isDisabled = false,
  isPending = false,
}: ButtonProps = {}) {
  return (
    <Button
      variant={variant}
      size={size}
      isDisabled={isDisabled}
      isPending={isPending}
    >
      {children}
    </Button>
  )
}
