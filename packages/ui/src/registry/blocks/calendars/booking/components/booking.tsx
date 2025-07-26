"use client";

import {
  ArrowRightIcon,
  BookIcon,
  ChevronRightIcon,
  ClockIcon,
  ContrastIcon,
  LanguagesIcon,
  LogOutIcon,
  PlusCircleIcon,
  Settings2Icon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";

import { Avatar } from "@dotui/ui/components/avatar";
import { Badge } from "@dotui/ui/components/badge";
import { Button } from "@dotui/ui/components/button";
import { Calendar } from "@dotui/ui/components/calendar";
import { Card, CardContent, CardHeader } from "@dotui/ui/components/card";
import { Label } from "@dotui/ui/components/field";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/ui/components/list-box";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSection,
} from "@dotui/ui/components/menu";
import { Overlay } from "@dotui/ui/components/overlay";
import { Popover } from "@dotui/ui/components/popover";
import { Select, SelectItem, SelectRoot } from "@dotui/ui/components/select";
import { Separator } from "@dotui/ui/components/separator";
import { Switch, SwitchRoot, SwitchThumb } from "@dotui/ui/components/switch";
import { TextField } from "@dotui/ui/components/text-field";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { ToggleButtonGroup } from "@dotui/ui/components/toggle-button-group";
import { ExternalLinkIcon, GoogleIcon } from "@dotui/ui/icons";
import { cn } from "@dotui/ui/lib/utils";

export function Booking({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "@max-3xl:flex @max-3xl:flex-col grid grid-cols-[1fr_auto_1fr] gap-0 p-0",
        className,
      )}
      {...props}
    >
      <div className="@max-3xl:flex @max-3xl:justify-between space-y-4 border-r p-6">
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
      <div className="border-l p-6 pt-6">
        <div className="">
          <span className="font-semibold">Sat</span> 26
        </div>
        <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto">
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
