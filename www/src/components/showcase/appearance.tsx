"use client"

import { useState } from "react"

import { MonitorIcon, MoonIcon, SunIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Switch, SwitchControl } from "@/registry/ui/switch"

const themes = [
  { id: "light", label: "Light", icon: SunIcon },
  { id: "dark", label: "Dark", icon: MoonIcon },
  { id: "system", label: "System", icon: MonitorIcon },
]

// The chart series: six distinct colors under every palette.
const accents = [
  { id: "chart-1", label: "Accent 1", className: "bg-(--chart-1)" },
  { id: "chart-2", label: "Accent 2", className: "bg-(--chart-2)" },
  { id: "chart-3", label: "Accent 3", className: "bg-(--chart-3)" },
  { id: "chart-4", label: "Accent 4", className: "bg-(--chart-4)" },
  { id: "chart-5", label: "Accent 5", className: "bg-(--chart-5)" },
  { id: "chart-6", label: "Accent 6", className: "bg-(--chart-6)" },
]

export function Appearance({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [theme, setTheme] = useState<string>("dark")
  const [accent, setAccent] = useState("chart-2")

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the app looks.</CardDescription>
      </CardHeader>
      <CardContent className="@container space-y-4">
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
                <t.icon className="size-4 @max-[18rem]:hidden" aria-hidden />
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
                  aria-label={a.label}
                  onClick={() => setAccent(a.id)}
                  className={cn(
                    "size-6 rounded-full transition-transform outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    a.className,
                    isSelected
                      ? "ring-2 ring-fg ring-offset-2 ring-offset-bg"
                      : "hover:scale-110",
                  )}
                />
              )
            })}
          </div>
        </div>

        <Switch className="w-full justify-between" defaultSelected={false}>
          <Label>Reduce motion</Label>
          <SwitchControl />
        </Switch>
      </CardContent>
    </Card>
  )
}
