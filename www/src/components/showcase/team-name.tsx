'use client'

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
import { Input } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

export function TeamName({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle>Team Name</CardTitle>
        <CardDescription>
          Your team's visible name across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TextField aria-label="Team Name" defaultValue="My Team">
          <Input />
        </TextField>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        <p className="text-sm text-fg-muted">
          Please use 32 characters at maximum.
        </p>
        <Button variant="primary">Save</Button>
      </CardFooter>
    </Card>
  )
}
