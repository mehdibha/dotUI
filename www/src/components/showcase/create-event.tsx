"use client"

import { parseDate, Time } from "@internationalized/date"

import { CalendarIcon, XIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Calendar } from "@/registry/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { DatePicker } from "@/registry/ui/date-picker"
import { DialogContent } from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import {
  DateInput,
  Input,
  InputGroup,
  InputGroupAddon,
} from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { TextField } from "@/registry/ui/text-field"
import { TimeField } from "@/registry/ui/time-field"

export function CreateEvent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>New event</CardTitle>
        <CardAction>
          <Button variant="quiet" size="sm" isIconOnly aria-label="Close">
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextField defaultValue="Design sync">
          <Label>Title</Label>
          <Input />
        </TextField>
        <DatePicker defaultValue={parseDate("2026-09-03")}>
          <Label>Date</Label>
          <InputGroup>
            <DateInput />
            <InputGroupAddon>
              <Button variant="secondary" size="sm" isIconOnly>
                <CalendarIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <Popover>
            <DialogContent>
              <Calendar />
            </DialogContent>
          </Popover>
        </DatePicker>
        <div className="flex gap-2">
          <TimeField className="min-w-0 flex-1" defaultValue={new Time(10, 0)}>
            <Label>From</Label>
            <DateInput />
          </TimeField>
          <TimeField className="min-w-0 flex-1" defaultValue={new Time(10, 30)}>
            <Label>To</Label>
            <DateInput />
          </TimeField>
        </div>
        <Select defaultValue="atlas">
          <Label>Room</Label>
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="atlas">Atlas — 4th floor</SelectItem>
            <SelectItem id="lumen">Lumen — 2nd floor</SelectItem>
            <SelectItem id="orbit">Orbit — 2nd floor</SelectItem>
            <SelectItem id="meet">Google Meet</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="quiet">Discard</Button>
        <Button variant="primary">Create event</Button>
      </CardFooter>
    </Card>
  )
}
