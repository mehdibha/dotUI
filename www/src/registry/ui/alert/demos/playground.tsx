'use client'

import type { ReactNode } from 'react'

import {
  Alert,
  AlertDescription,
  AlertTitle,
  type AlertProps,
} from '@/registry/ui/alert'

export default function Demo({
  title = 'Update available',
  description = 'A new version is ready to install. Restart the app to apply it.',
  variant = 'neutral',
  icon,
}: {
  title?: string
  description?: string
  variant?: AlertProps['variant']
  icon?: ReactNode
} = {}) {
  return (
    <Alert variant={variant} className="max-w-md">
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  )
}
