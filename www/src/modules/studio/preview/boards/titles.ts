/** Each board's title; the panel reads it without the boards' loaders. */
export const BOARD_TITLES = {
  color: "Color",
  typography: "Typography",
  icons: "Icons",
  shape: "Shape",
  space: "Density",
  states: "Interaction",
  motion: "Motion",
  buttons: "Buttons",
  inputs: "Inputs",
  selection: "Selection",
  menus: "Menus & popovers",
  dialogs: "Dialogs & sheets",
  nav: "Navigation",
  dates: "Date & time",
  display: "Data display",
  feedback: "Feedback",
  charts: "Charts",
}

export type BoardId = keyof typeof BOARD_TITLES
