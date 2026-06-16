'use client'

import { ShieldCheckIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'
import { OTPField, OTPFieldSeparator } from '@/registry/ui/otp-field'

export function TwoFactor({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle>Two-factor authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code we sent to your phone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OTPField
          length={6}
          defaultValue="029"
          aria-label="Verification code"
          className="items-center"
        >
          <div className="flex items-center">
            <Group>
              <Input />
              <Input aria-label="Digit 2" />
              <Input aria-label="Digit 3" />
            </Group>
            <OTPFieldSeparator className="px-2 text-fg-muted">
              -
            </OTPFieldSeparator>
            <Group>
              <Input aria-label="Digit 4" />
              <Input aria-label="Digit 5" />
              <Input aria-label="Digit 6" />
            </Group>
          </div>
        </OTPField>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-fg-muted">
          <ShieldCheckIcon className="size-4 shrink-0" />
          <span className="min-w-0">Code expires in 5 minutes</span>
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="primary" className="w-full">
          Verify
        </Button>
        <Button variant="quiet" className="w-full">
          Resend code
        </Button>
      </CardFooter>
    </Card>
  )
}
