import { DEFAULT_VARIANTS } from "../constants";
import type { Variants, VariantsDefinition } from "../types";

export const createVariants = (
  variantsDefinition: VariantsDefinition,
): Variants => {
  const {
    buttons,
    calendars,
    "badge-and-tag-group": badgeAndTagGroup,
    "list-box-and-menu": listBoxAndMenu,
    checkboxes,
    radios,
    inputs,
    overlays,
    pickers,
    selection,
    ...restVariants
  } = variantsDefinition;

  return {
    ...DEFAULT_VARIANTS,
    ...restVariants,
    button: buttons,
    calendar: calendars,
    badge: badgeAndTagGroup,
    "tag-group": badgeAndTagGroup,
    "list-box": listBoxAndMenu,
    menu: listBoxAndMenu,
    checkbox: checkboxes,
    "radio-group": radios,
    input: inputs,
    popover: overlays,
    modal: overlays,
    drawer: overlays,
    "date-picker": pickers,
    combobox: pickers,
    select: selection,
  };
};
