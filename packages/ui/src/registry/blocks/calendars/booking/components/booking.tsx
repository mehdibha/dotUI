"use client";

import { ClockIcon } from "lucide-react";

import { Avatar } from "@dotui/ui/components/avatar";
import { Button } from "@dotui/ui/components/button";
import { Calendar } from "@dotui/ui/components/calendar";
import { Card } from "@dotui/ui/components/card";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { GoogleIcon } from "@dotui/ui/icons";
import { cn } from "@dotui/ui/lib/utils";

export function Booking({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("@container", className)} {...props}>
      <Card
        className={cn(
          "@max-3xl:flex @max-3xl:flex-col @max-3xl:h-auto h-90 grid grid-cols-[1fr_auto_1fr] gap-0 p-0",
        )}
      >
        <div className="@max-3xl:flex @max-3xl:justify-between @3xl:border-r @max-3xl:border-b space-y-4 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Avatar src="https://github.com/mehdibha.png" />
              <div>
                <div className="font-semibold">mehdibha</div>
                <div className="text-fg-muted text-sm">hello@mehdibha.com</div>
              </div>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              30 min meeting
            </h1>
          </div>
          <div className="@max-lg:hidden space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon /> 30mn
            </div>
            <div className="flex items-center gap-2 text-sm">
              <GoogleIcon /> Google meet
            </div>
            <Select defaultSelectedKey="aftica/tunis">
              <SelectItem id="aftica/tunis">Aftica/Tunis</SelectItem>
            </Select>
          </div>
        </div>
        <div className="p-6">
          <Calendar
            variant="primary"
            className="border-0 bg-transparent p-0 [&_[data-slot='calendar-cell']]:size-12"
          />
        </div>
        <div className="@max-3xl:border-t @3xl:border-l flex h-full min-h-0 flex-col pt-6">
          <div className="px-6">
            <span className="font-semibold">Sat</span> 26
          </div>
          <div className="mt-4 flex-1 space-y-3 overflow-y-auto px-6 pb-4">
            <div className="@max-3xl:grid-cols-2 grid gap-1.5">
              {timeSlots.map(({ time: timeSlot, available }) => (
                <Button key={timeSlot} size="sm" className="w-full">
                  {timeSlot}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

const timeSlots = [
  { time: "09:00", available: false },
  { time: "09:30", available: false },
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "12:00", available: false },
  { time: "12:30", available: true },
  { time: "13:00", available: true },
  { time: "13:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: false },
  { time: "15:00", available: false },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
  { time: "17:00", available: true },
  { time: "17:30", available: true },
];
