"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";
import { Button } from "@/registry/ui/default/core/button";
import {
  CalendarRoot,
  CalendarHeader,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
} from "@/registry/ui/default/core/calendar";
import { Heading } from "@/registry/ui/default/core/heading";

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
