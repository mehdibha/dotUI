"use client";

import * as React from "react";
import { DatePicker } from "@/lib/components/core/default/date-picker";

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();

  return <DatePicker />;

  return null;
  // return (
  //   <Popover>
  //     <PopoverTrigger asChild>
  //       <Button
  //         variant={"outline"}
  //         className={cn(
  //           "w-[280px] justify-start text-left font-normal",
  //           !date && "text-fg-muted"
  //         )}
  //       >
  //         <CalendarIcon className="mr-2 h-4 w-4" />
  //         {date ? format(date, "PPP") : <span>Pick a date</span>}
  //       </Button>
  //     </PopoverTrigger>
  //     <PopoverContent className="w-auto p-0">
  //       <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
  //     </PopoverContent>
  //   </Popover>
  // );
}
