'use client'

import { useState } from 'react'
import { CheckCircle2Icon, XIcon } from 'lucide-react'

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/registry/ui/alert'
import { Button } from '@/registry/ui/button'

export default function Demo() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return (
      <Button variant="quiet" size="sm" onPress={() => setIsVisible(true)}>
        Show alert
      </Button>
    )
  }

  return (
    <Alert variant="success">
      <CheckCircle2Icon />
      <AlertTitle>Changes saved</AlertTitle>
      <AlertDescription>
        Your profile has been updated successfully.
      </AlertDescription>
      <AlertAction>
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Dismiss"
          onPress={() => setIsVisible(false)}
        >
          <XIcon />
        </Button>
      </AlertAction>
    </Alert>
  )
}
