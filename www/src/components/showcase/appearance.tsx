'use client'

import { useState } from 'react'

import { MonitorIcon, MoonIcon, SunIcon } from '@/registry/icons'
import { cn } from '@/registry/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { Label } from '@/registry/ui/field'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import { Switch, SwitchControl } from '@/registry/ui/switch'

const themes = [
  { id: 'light', label: 'Light', icon: SunIcon },
  { id: 'dark', label: 'Dark', icon: MoonIcon },
  { id: 'system', label: 'System', icon: MonitorIcon },
]

const accents = [
  { id: 'primary', className: 'bg-primary' },
  { id: 'info', className: 'bg-info' },
  { id: 'success', className: 'bg-success' },
  { id: 'warning', className: 'bg-warning' },
  { id: 'danger', className: 'bg-danger' },
  { id: 'accent', className: 'bg-accent' },
]

export function Appearance({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [theme, setTheme] = useState<string>('dark')
  const [accent, setAccent] = useState('info')

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the app looks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label id="theme-label">Theme</Label>
          <SegmentedControl
            aria-labelledby="theme-label"
            selectedKeys={new Set([theme])}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (next != null) setTheme(String(next))
            }}
            className="grid w-full grid-cols-3"
          >
            {themes.map((t) => (
              <SegmentedControlItem key={t.id} id={t.id}>
                <t.icon className="size-4" aria-hidden />
                {t.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label id="accent-label">Accent</Label>
          <div
            role="radiogroup"
            aria-labelledby="accent-label"
            className="flex items-center gap-2"
          >
            {accents.map((a) => {
              const isSelected = accent === a.id
              return (
                <button
                  key={a.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={a.id}
                  onClick={() => setAccent(a.id)}
                  className={cn(
                    'size-6 rounded-full transition-transform outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                    a.className,
                    isSelected
                      ? 'ring-2 ring-fg ring-offset-2 ring-offset-bg'
                      : 'hover:scale-110',
                  )}
                />
              )
            })}
          </div>
        </div>

        <Switch
          className="w-full justify-between text-sm"
          defaultSelected={false}
        >
          <Label>Reduce motion</Label>
          <SwitchControl />
        </Switch>
      </CardContent>
    </Card>
  )
}
