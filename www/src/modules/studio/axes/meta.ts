/* Panel-only: each enum key's labelled options, keyed like SCHEMA (index.ts).
   Sections import their lists from `<chapter>.meta.ts`; this map is for
   code that names any key's value. */

import * as accordion from "./accordion.meta"
import * as alert from "./alert.meta"
import * as avatars from "./avatars.meta"
import * as badges from "./badges.meta"
import * as breadcrumbs from "./breadcrumbs.meta"
import * as buttonGroups from "./button-groups.meta"
import * as buttons from "./buttons.meta"
import * as calendar from "./calendar.meta"
import * as card from "./card.meta"
import * as charts from "./charts.meta"
import * as checkbox from "./checkbox.meta"
import * as choiceCards from "./choice-cards.meta"
import * as color from "./color.meta"
import type { Option } from "./core/meta"
import * as dialogs from "./dialogs.meta"
import * as field from "./field.meta"
import * as icons from "./icons.meta"
import * as inputs from "./inputs.meta"
import * as kbd from "./kbd.meta"
import * as links from "./links.meta"
import * as menus from "./menus.meta"
import * as motion from "./motion.meta"
import * as navigation from "./navigation.meta"
import * as numberField from "./number-field.meta"
import * as otpField from "./otp-field.meta"
import * as pagination from "./pagination.meta"
import * as progress from "./progress.meta"
import * as radio from "./radio.meta"
import * as segmentedControl from "./segmented-control.meta"
import * as select from "./select.meta"
import * as selection from "./selection.meta"
import * as shape from "./shape.meta"
import * as skeleton from "./skeleton.meta"
import * as sliders from "./sliders.meta"
import * as space from "./space.meta"
import * as spinner from "./spinner.meta"
import * as states from "./states.meta"
import * as surfaces from "./surfaces.meta"
import * as switchAxis from "./switch.meta"
import * as tables from "./tables.meta"
import * as toast from "./toast.meta"
import * as toggles from "./toggles.meta"
import * as tooltips from "./tooltips.meta"
import * as type from "./type.meta"

export const OPTIONS: Readonly<Partial<Record<string, readonly Option[]>>> =
  Object.assign(
    {},
    accordion.OPTIONS,
    alert.OPTIONS,
    avatars.OPTIONS,
    badges.OPTIONS,
    breadcrumbs.OPTIONS,
    buttonGroups.OPTIONS,
    buttons.OPTIONS,
    calendar.OPTIONS,
    card.OPTIONS,
    charts.OPTIONS,
    checkbox.OPTIONS,
    choiceCards.OPTIONS,
    color.OPTIONS,
    dialogs.OPTIONS,
    field.OPTIONS,
    icons.OPTIONS,
    inputs.OPTIONS,
    kbd.OPTIONS,
    links.OPTIONS,
    menus.OPTIONS,
    motion.OPTIONS,
    navigation.OPTIONS,
    numberField.OPTIONS,
    otpField.OPTIONS,
    pagination.OPTIONS,
    progress.OPTIONS,
    radio.OPTIONS,
    segmentedControl.OPTIONS,
    select.OPTIONS,
    selection.OPTIONS,
    shape.OPTIONS,
    skeleton.OPTIONS,
    space.OPTIONS,
    sliders.OPTIONS,
    spinner.OPTIONS,
    states.OPTIONS,
    surfaces.OPTIONS,
    switchAxis.OPTIONS,
    tables.OPTIONS,
    toast.OPTIONS,
    toggles.OPTIONS,
    tooltips.OPTIONS,
    type.OPTIONS,
  )
