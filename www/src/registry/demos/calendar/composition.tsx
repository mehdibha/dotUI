"use client";

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
import { ChevronLeftIcon, ChevronRightIcon } from "@/__icons__";

export default function Demo() {
  return (
    <CalendarRoot>
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
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </CalendarRoot>
  );
}
