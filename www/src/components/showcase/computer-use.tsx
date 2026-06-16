'use client'

import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { Separator } from '@/registry/ui/separator'
import { Switch, SwitchControl } from '@/registry/ui/switch'

function SettingRow({
  title,
  detail,
  defaultOn,
}: {
  title: string
  detail: string
  defaultOn?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-fg-muted">{detail}</p>
      </div>
      <Switch
        aria-label={title}
        defaultSelected={defaultOn}
        className="shrink-0"
      >
        <SwitchControl />
      </Switch>
    </div>
  )
}

export function ComputerUse({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Computer use
          <Badge appearance="subtle" variant="neutral" size="sm">
            Beta
          </Badge>
        </CardTitle>
        <CardDescription>Let Claude act in apps you allow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <SettingRow
          title="Enable computer use"
          detail="Screenshots and input control."
          defaultOn
        />
        <Separator />
        <SettingRow
          title="Unhide apps when done"
          detail="Restore apps when Claude stops."
          defaultOn
        />
        <Separator />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-medium">Denied apps</p>
            <p className="text-xs text-fg-muted">None denied yet.</p>
          </div>
          <Button size="sm" className="shrink-0">
            Add app
            <ChevronDownIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
