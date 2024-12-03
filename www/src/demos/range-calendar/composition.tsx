"use client";

import { Button } from "@/registry/ui/default/core/button";
import {
  CalendarHeader,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
} from "@/registry/ui/default/core/calendar";
import { Heading } from "@/registry/ui/default/core/heading";
import { RangeCalendarRoot } from "@/registry/ui/default/core/range-calendar";
import { ChevronLeftIcon, ChevronRightIcon } from "@/__icons__";

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
