import type { Variants, VariantsDefinition } from "../types";

/**
 * Default variants for all components.
 * This will be populated by the registry package.
 */
let defaultVariants: Partial<Variants> = {};

/**
 * Set the default variants (called by registry package)
 */
export const setDefaultVariants = (variants: Partial<Variants>): void => {
  defaultVariants = variants;
};

/**
 * Create resolved variants from a variants definition
 */
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
    ...defaultVariants,
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
  } as Variants;
};
