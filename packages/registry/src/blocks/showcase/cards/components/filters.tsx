"use client";

// import { ZapIcon } from "lucide-react";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { Description, Label } from "@dotui/registry/ui/field";
import { Slider, SliderControl, SliderOutput } from "@dotui/registry/ui/slider";
import { Switch } from "@dotui/registry/ui/switch";
import { Tag, TagGroup, TagList } from "@dotui/registry/ui/tag-group";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@dotui/registry/ui/toggle-button-group";

export function Filters({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label id="type-of-place">Type of place</Label>
          <ToggleButtonGroup
            aria-labelledby="type-of-place"
            selectionMode="single"
            defaultSelectedKeys={["any-type"]}
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
        <TagGroup>
          <Label>Amenities</Label>
          <TagList>
            <Tag>Wifi</Tag>
            <Tag>TV</Tag>
            <Tag>Kitchen</Tag>
            <Tag>Pool</Tag>
            <Tag>Washer</Tag>
            <Tag>Dryer</Tag>
            <Tag>Heating</Tag>
            <Tag>Hair dryer</Tag>
            <Tag>EV charger</Tag>
            <Tag>Gym</Tag>
            <Tag>BBQ grill</Tag>
            <Tag>Breakfast</Tag>
          </TagList>
        </TagGroup>
        <Switch
          //  variant="card"
          className="text-sm"
          defaultSelected
        >
          <span className="flex items-center gap-2">
            {/* <ZapIcon className="size-4" /> */}
            Instant booking
          </span>
        </Switch>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Clear all</Button>
        <Button variant="primary">Show results</Button>
      </CardFooter>
    </Card>
  );
}
