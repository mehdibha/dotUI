"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import {
  CalendarRoot,
  CalendarHeader,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
} from "@/components/dynamic-core/calendar";
import { Heading } from "@/components/dynamic-core/heading";

export default function Demo() {
  return (
    <CalendarRoot aria-label="Event date">
      <CalendarHeader>
        <Button slot="previous" variant="outline" shape="circle" size="sm">
          <ChevronLeftIcon />
        </Button>
        <Heading className="text-fg-muted text-sm" />
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
    </CalendarRoot>
  );
}
