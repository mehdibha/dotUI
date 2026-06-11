'use client'

// import { ZapIcon } from "lucide-react";
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { Description, Label } from '@/registry/ui/field'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'
import { Switch, SwitchControl } from '@/registry/ui/switch'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

export function Filters({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label id="type-of-place">Type of place</Label>
          <ToggleButtonGroup
            aria-labelledby="type-of-place"
            selectionMode="single"
            defaultSelectedKeys={['any-type']}
            className="grid w-full grid-cols-3"
          >
            <ToggleButton id="any-type">Any type</ToggleButton>
            <ToggleButton id="room">Room</ToggleButton>
            <ToggleButton id="entire-home">Entire home</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <Slider
          defaultValue={[200, 800]}
          minValue={0}
          maxValue={2000}
          className="w-full"
        >
          <div className="flex justify-between gap-2">
            <Label>Price Range</Label>
            <SliderOutput />
          </div>
          <SliderControl />
          <Description>Trip price, includes all fees</Description>
        </Slider>
        <TagGroup
          selectionMode="multiple"
          defaultSelectedKeys={['wifi', 'kitchen']}
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
        <Switch className="text-sm" defaultSelected>
          <SwitchControl />
          <Label>Instant booking</Label>
        </Switch>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Clear all</Button>
        <Button variant="primary">Show results</Button>
      </CardFooter>
    </Card>
  )
}
