"use client";

// import React from "react";
// import {
//   getLocalTimeZone,
//   isWeekend,
//   parseDate,
//   today,
// } from "@internationalized/date";
// import { useLocale } from "react-aria";
// import type { CalendarDate } from "@internationalized/date";
// import type { DateValue } from "react-aria";

// import { Button } from "@dotui/registry-v2/ui/button";
// import { Calendar, RangeCalendar } from "@dotui/registry-v2/ui/calendar";
// import { Card, CardContent, CardFooter } from "@dotui/registry-v2/ui/card";

export function CalendarDemo() {
  return (
    <div className="mx-auto flex max-w-4xl flex-1 flex-col flex-wrap justify-center gap-8 p-10 lg:flex-row">
      {/* <CalendarSingle />
      <CalendarRange />
      <CalendarWithUnavailableDates />
      <CalendarWithPresets />
      <CalendarCustomized /> */}
    </div>
  );
}

// const CalendarSingle = () => {
//   return <Calendar defaultValue={parseDate("2025-01-01")} />;
// };

// const CalendarRange = () => {
//   return (
//     <RangeCalendar
//       defaultValue={{
//         start: parseDate("2025-01-01"),
//         end: parseDate("2025-01-05"),
//       }}
//     />
//   );
// };

// const CalendarWithUnavailableDates = () => {
//   const now = today(getLocalTimeZone());
//   const disabledRanges: [CalendarDate, CalendarDate][] = [
//     [now, now.add({ days: 5 })],
//     [now.add({ days: 14 }), now.add({ days: 16 })],
//     [now.add({ days: 23 }), now.add({ days: 24 })],
//   ];

//   const { locale } = useLocale();
//   const isDateUnavailable = (date: DateValue) =>
//     isWeekend(date, locale) ||
//     disabledRanges.some(
//       (interval) =>
//         date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0,
//     );

//   return (
//     <Calendar
//       aria-label="Appointment date"
//       minValue={today(getLocalTimeZone())}
//       isDateUnavailable={isDateUnavailable}
//     />
//   );
// };

// const CalendarWithPresets = () => {
//   const now = today(getLocalTimeZone());
//   const [date, setDate] = React.useState<DateValue>(now);

//   return (
//     <div className="flex max-w-[300px] flex-col">
//       <Card className="w-fit py-4">
//         <CardContent className="px-4">
//           <Calendar value={date} onChange={setDate} />
//         </CardContent>
//         <CardFooter className="flex flex-wrap gap-2 border-t px-4 pt-4">
//           {[
//             { label: "Today", value: 0 },
//             { label: "Tomorrow", value: 1 },
//             { label: "In 3 days", value: 3 },
//             { label: "In a week", value: 7 },
//             { label: "In 2 weeks", value: 14 },
//           ].map((preset) => (
//             <Button
//               key={preset.value}
//               size="sm"
//               className="flex-1"
//               onClick={() => {
//                 const newDate = now.add({ days: preset.value });
//                 setDate(newDate);
//               }}
//             >
//               {preset.label}
//             </Button>
//           ))}
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// const CalendarCustomized = () => {
//   return (
//     <div className="flex flex-col">
//       <Calendar aria-label="Appointment date" />
//     </div>
//   );
// };
