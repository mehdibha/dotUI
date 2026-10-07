import CalendarDemo from "@/registry/ui/calendar/demos/single"
import DatePickerDemo from "@/registry/ui/date-picker/demos/basic"
import TimeFieldDemo from "@/registry/ui/time-field/demos/default"

import { Board, BoardSection } from "./board"

export default function DatesBoard() {
  return (
    <Board id="dates">
      <BoardSection
        member="calendar"
        title="Calendar"
        axes={[
          "calendarDayShape",
          "calendarToday",
          "calendarTodayColor",
          "calendarWeekdays",
          "checkboxColor",
          "dateMotion",
          "motion",
        ]}
      >
        <CalendarDemo />
      </BoardSection>
      <BoardSection
        member="date-picker"
        title="Date picker"
        axes={["inputStyle"]}
      >
        <DatePickerDemo />
      </BoardSection>
      <BoardSection member="time-field" title="Time field">
        <TimeFieldDemo />
      </BoardSection>
    </Board>
  )
}
