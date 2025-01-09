"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import {
  CalendarHeader,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
} from "@/components/dynamic-core/calendar";
import { Heading } from "@/components/dynamic-core/heading";
import { RangeCalendarRoot } from "@/components/dynamic-core/range-calendar";

export default function Demo() {
  return (
    <RangeCalendarRoot>
      <CalendarHeader>
        <Button slot="previous" variant="outline" shape="square" size="sm">
          <ChevronLeftIcon />
        </Button>
        <Heading className="text-sm" />
        <Button slot="next" variant="outline" shape="square" size="sm">
          <ChevronRightIcon />
        </Button>
      </CalendarHeader>
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell date={date} range>
              {({ formattedDate }) => (
                <span className="z-20">{formattedDate}</span>
              )}
            </CalendarCell>
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </RangeCalendarRoot>
  );
}
