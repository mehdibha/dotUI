"use client"

import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Label } from "@/registry/ui/field"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"

export function UsageLimit(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Spending limit</CardTitle>
        <CardDescription>
          Pause the API when usage exceeds your monthly cap.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Slider defaultValue={250} maxValue={500} step={10}>
          <div className="flex items-center justify-between">
            <Label>Monthly cap</Label>
            <SliderOutput>
              {({ state }) => `$${state.values[0]} of $500`}
            </SliderOutput>
          </div>
          <SliderControl />
        </Slider>
        <p className="mt-3 text-sm text-fg-muted">
          Current usage: $187.42 this month
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="primary">Save limit</Button>
      </CardFooter>
    </Card>
  )
}
