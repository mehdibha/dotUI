"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Heading } from "react-aria-components";
import { Button } from "@/components/dynamic-ui/button";
import {
  CalendarHeader,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
} from "@/components/dynamic-ui/calendar";
import { RangeCalendarRoot } from "@/components/dynamic-ui/calendar";

export default function Demo() {
  return (
    <RangeCalendarRoot aria-label="Trip dates">
      <CalendarHeader>
        <Button slot="previous" variant="outline" shape="circle" size="sm">
          <ChevronLeftIcon />
        </Button>
        <Heading className="text-sm" />
        <Button slot="next" variant="outline" shape="circle" size="sm">
          <ChevronRightIcon />
        </Button>
      </CalendarHeader>
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </RangeCalendarRoot>
  );
}
