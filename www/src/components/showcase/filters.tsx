"use client"

import { useState } from "react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Description, FieldContent, Label } from "@/registry/ui/field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"

const PRICE_MAX = 2000
// Nightly prices cluster in a mid-market hump with a long tail.
const PRICE_BUCKETS = [
  6, 9, 11, 16, 21, 33, 42, 56, 63, 59, 65, 50, 53, 39, 31, 25, 20, 16, 13, 11,
  9, 7, 6, 5,
]
const BUCKET_SIZE = PRICE_MAX / PRICE_BUCKETS.length
const BUCKET_PEAK = Math.max(...PRICE_BUCKETS)

export function Filters({ className, ...props }: React.ComponentProps<"div">) {
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 800])

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label id="type-of-place">Type of place</Label>
          <SegmentedControl
            aria-labelledby="type-of-place"
            defaultSelectedKeys={["any-type"]}
            className="grid w-full grid-cols-3"
          >
            <SegmentedControlItem id="any-type">Any type</SegmentedControlItem>
            <SegmentedControlItem id="room">Room</SegmentedControlItem>
            <SegmentedControlItem id="entire-home">
              Entire home
            </SegmentedControlItem>
          </SegmentedControl>
        </div>
        <Slider
          value={priceRange}
          onChange={(value) => setPriceRange(value as [number, number])}
          minValue={0}
          maxValue={PRICE_MAX}
          formatOptions={{
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }}
          className="w-full"
        >
          <div className="flex justify-between gap-2">
            <Label>Price range</Label>
            <SliderOutput />
          </div>
          <div aria-hidden className="flex h-11 items-end gap-0.5">
            {PRICE_BUCKETS.map((count, index) => {
              const price = (index + 0.5) * BUCKET_SIZE
              const inRange = price >= priceRange[0] && price <= priceRange[1]
              return (
                <div
                  key={index}
                  style={{ height: `${(count / BUCKET_PEAK) * 100}%` }}
                  className={cn(
                    "min-h-0.5 flex-1 rounded-xs transition-colors",
                    inRange ? "bg-(--slider-fill-color)" : "bg-neutral",
                  )}
                />
              )
            })}
          </div>
          <SliderControl />
          <Description>Trip price, includes all fees</Description>
        </Slider>
        <TagGroup
          selectionMode="multiple"
          defaultSelectedKeys={["wifi", "kitchen"]}
        >
          <Label>Amenities</Label>
          <TagList>
            <Tag id="wifi">Wifi</Tag>
            <Tag id="kitchen">Kitchen</Tag>
            <Tag id="pool">Pool</Tag>
            <Tag id="washer">Washer</Tag>
            <Tag id="heating">Heating</Tag>
            <Tag id="gym">Gym</Tag>
          </TagList>
        </TagGroup>
        <Switch className="w-full" defaultSelected>
          <SwitchControl>
            <FieldContent className="flex-1">
              <div className="flex items-center gap-2">
                <SwitchIndicator />
                <Label>Instant booking</Label>
              </div>
              <Description>Book without waiting for host approval.</Description>
            </FieldContent>
          </SwitchControl>
        </Switch>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Clear all</Button>
        <Button variant="primary">Show results</Button>
      </CardFooter>
    </Card>
  )
}
