"use client"

import { ChevronDownIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Description, FieldContent, Label } from "@/registry/ui/field"
import { Separator } from "@/registry/ui/separator"
import { Switch, SwitchControl } from "@/registry/ui/switch"

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
    <Switch
      defaultSelected={defaultOn}
      className="w-full justify-between gap-3"
    >
      <FieldContent>
        <Label>{title}</Label>
        <Description>{detail}</Description>
      </FieldContent>
      <SwitchControl />
    </Switch>
  )
}

export function ComputerUse({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Computer use
          <Badge variant="neutral" size="sm">
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
          <FieldContent>
            <Label elementType="span">Denied apps</Label>
            <Description>None denied yet.</Description>
          </FieldContent>
          <Button size="sm" className="shrink-0">
            Add app
            <ChevronDownIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
