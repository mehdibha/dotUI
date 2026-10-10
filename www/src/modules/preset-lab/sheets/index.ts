import { ActionsSheet } from "./actions"
import { CommandSheet } from "./command"
import { DatesSheet } from "./dates"
import { DialogSheet, DrawerSheet } from "./dialog"
import { DisplaySheet } from "./display"
import { FeedbackSheet } from "./feedback"
import { FieldsSheet } from "./fields"
import { MenuSheet } from "./menu"
import { NavigationSheet } from "./navigation"
import { SelectionSheet } from "./selection"
import { TypeSheet } from "./type"

export const SHEETS = {
  actions: ActionsSheet,
  fields: FieldsSheet,
  selection: SelectionSheet,
  menu: MenuSheet,
  dialog: DialogSheet,
  drawer: DrawerSheet,
  command: CommandSheet,
  navigation: NavigationSheet,
  feedback: FeedbackSheet,
  display: DisplaySheet,
  dates: DatesSheet,
  type: TypeSheet,
}

export type SheetName = keyof typeof SHEETS
