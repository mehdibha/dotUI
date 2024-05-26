"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Calendar as AriaCalendar,
  RangeCalendar as AriaRangeCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  Heading as AriaHeading,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  CalendarGridBody as AriaCalendarGridBody,
  type CalendarProps as AriaCalendarProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";
import { focusRing } from "@/lib/utils/styles";
import { Button, buttonVariants } from "./button";

// interface CalendarProps extends AriaCalendarProps {}

const calendarStyles = tv({
  slots: {
    root: "",
    header: "",
    grid: "",
    cell: "",
  },
});

const Calendar = React.forwardRef(({ className, ...props }) => {
  return (
    <AriaCalendar className={cn("w-fit max-w-full rounded-md border bg-bg p-3", className)} {...props}>
      <header className="mb-4 flex items-center justify-between gap-2">
        <Button slot="previous" variant="outline" shape="square" size="sm">
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <AriaHeading className="text-sm font-medium" />
        <Button slot="next" variant="outline" shape="square" size="sm">
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </header>
      <AriaCalendarGrid className="w-full border-collapse">
        <AriaCalendarGridHeader className="mb-4">
          {(day) => (
            <AriaCalendarHeaderCell className="text-xs font-normal text-fg-muted">
              {day}
            </AriaCalendarHeaderCell>
          )}
        </AriaCalendarGridHeader>
        <AriaCalendarGridBody className="[&>tr>td]:p-0">
          {(date) => (
            <AriaCalendarCell
              date={date}
              className={buttonVariants({
                variant: "ghost",
                shape: "square",
                size: "sm",
                className: cn(
                  "my-1 selected:bg-bg-primary selected:text-fg-onPrimary disabled:cursor-default disabled:bg-transparent"
                ),
              })}
            />
          )}
        </AriaCalendarGridBody>
      </AriaCalendarGrid>
    </AriaCalendar>
  );
});
Calendar.displayName = "Calendar";

const RangeCalendar = React.forwardRef((props) => {
  return (
    <AriaRangeCalendar
      className="w-fit max-w-full rounded-md border bg-bg p-3"
      {...props}
    >
      <header className="mb-4 flex items-center justify-between gap-2">
        <Button slot="previous" variant="outline" shape="square" size="sm">
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <AriaHeading className="text-sm font-medium" />
        <Button slot="next" variant="outline" shape="square" size="sm">
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </header>
      <AriaCalendarGrid className="w-full border-collapse">
        {/* <AriaCalendarGridHeader className="mb-4">
          {(day) => (
            <AriaCalendarHeaderCell className="text-xs font-normal text-fg-muted">
              {day}
            </AriaCalendarHeaderCell>
          )}
        </AriaCalendarGridHeader> */}
        <AriaCalendarGridBody className="[&>tr>td]:p-0">
          {(date) => (
            <AriaCalendarCell
              date={date}
              className={cn(
                "relative my-1 flex size-8 items-center justify-center rounded-md text-sm font-normal leading-normal",
                "after:absolute after:inset-0 after:transition-colors after:content-[''] selected:after:bg-gray-800",
                "before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:transition-colors before:content-[''] hover:before:bg-bg-inverse/10",
                "outline-none before:border before:border-transparent before:ring-0 before:ring-border-focus focus-visible:z-50 focus-visible:before:border-border focus-visible:before:ring-2 focus-visible:before:ring-offset-2 focus-visible:before:ring-offset-bg",
                "selection-start:after:rounded-l-[inherit] selection-end:after:rounded-r-[inherit]",
                "selection-start:pressed:before:bg-primary/90 selection-start:text-fg-onPrimary selection-start:before:bg-bg-primary",
                "selection-end:pressed:before:bg-primary/90 selection-end:text-fg-onPrimary selection-end:before:bg-bg-primary"

                // "selected:bg-slate-800",
                // "before:absolute before:inset-0 before:rounded-md before:transition-colors before:content-[''] hover:before:bg-bg-inverse/10 pressed:before:bg-bg-inverse/15",
                // "selection-start:rounded-l-md selection-start:text-fg-onPrimary selection-start:before:bg-bg-primary",
                // "selection-end:rounded-r-md selection-end:text-fg-onPrimary selection-end:before:bg-bg-primary"
              )}
              // className={({}) =>
              //   buttonVariants({
              //     variant: "ghost",
              //     shape: "square",
              //     size: "sm",
              //     className: cn(
              //       "relative my-1 disabled:cursor-default disabled:bg-transparent",
              //       "selected:z-50",
              //       "unavailable:line-through",
              //       "selection-start:bg-bg-primary selection-start:text-fg-onPrimary",
              //       "selection-end:bg-bg-primary selection-end:text-fg-onPrimary selection-end:after:content-none",
              //       "selected:after:content-[''] selected:after:absolute selected:after:inset-0 selected:after:bg-slate-800 selected:after:z-[-1]",
              //       "selection-start:after:inset-y-0 selection-start:after:left-[50%] selection-start:after:right-0",
              //       "selection-end:after:inset-y-0 selection-end:after:right-[50%] selection-end:after:left-0"
              //       // "selected:bg-bg-primary selected:text-fg-onPrimary",
              //       // "selected:z-10 selected:bg-slate-100 [&:not([data-selected])]:rounded",
              //       // "selection-start:text-white selected:selection-start:rounded-s selected:selection-start:bg-black",
              //       // "outside-month:text-slate-300 ",
              //       // "selection-end:text-white selected:selection-end:rounded-e selected:selection-end:bg-black",
              //       // "disabled:cursor-not-allowed disabled:hover:!bg-transparent"
              //     ),
              //   })
              // }
            >
              {({ formattedDate }) => (
                <span
                  className="z-20"
                  // className={buttonVariants({
                  //   variant: "ghost",
                  //   shape: "square",
                  //   size: "sm",
                  // })}
                >
                  {formattedDate}
                </span>
              )}
            </AriaCalendarCell>
          )}
        </AriaCalendarGridBody>
      </AriaCalendarGrid>
    </AriaRangeCalendar>
  );
});
RangeCalendar.displayName = "Calendar";

export { Calendar, RangeCalendar };

// function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   ...props
// }: CalendarProps) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn("p-3", className)}
//       classNames={{
//         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
//         month: "space-y-4",
//         caption: "flex justify-center pt-1 relative items-center",
//         caption_label: "text-sm font-medium",
//         nav: "space-x-1 flex items-center",
//         nav_button: cn(
//           buttonVariants({ variant: "outline" }),
//           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
//         ),
//         nav_button_previous: "absolute left-1",
//         nav_button_next: "absolute right-1",
//         table: "w-full border-collapse space-y-1",
//         head_row: "flex",
//         head_cell: "text-fg-muted rounded-md w-9 font-normal text-[0.8rem]",
//         row: "flex w-full mt-2",
//         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
//         day: cn(
//           buttonVariants({ variant: "ghost" }),
//           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
//         ),
//         day_range_end: "day-range-end",
//         day_selected:
//           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//         day_today: "bg-accent text-accent-foreground",
//         day_outside:
//           "day-outside text-fg-muted opacity-50 aria-selected:bg-accent/50 aria-selected:text-fg-muted aria-selected:opacity-30",
//         day_disabled: "text-fg-muted opacity-50",
//         day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
//         day_hidden: "invisible",
//         ...classNames,
//       }}
//       components={{
//         IconLeft: () => <ChevronLeft className="h-4 w-4" />,
//         IconRight: () => <ChevronRight className="h-4 w-4" />,
//       }}
//       {...props}
//     />
//   );
// }
// Calendar.displayName = "Calendar";
