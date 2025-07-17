import { tv } from "tailwind-variants";
import type { ClassValue } from "clsx";

import {
  useDynamicFocusGroup,
  useDynamicFocusInput,
  useDynamicFocusRing,
} from "../helpers/focus-provider";

export const createDynamicFocusRing = (additionalClasses?: ClassValue) => {
  return () => {
    const dynamicFocusRing = useDynamicFocusRing();
    return tv({
      extend: dynamicFocusRing,
      base: typeof additionalClasses === "string" ? additionalClasses : "",
    });
  };
};

export const createDynamicFocusGroup = (additionalClasses?: ClassValue) => {
  return () => {
    const dynamicFocusGroup = useDynamicFocusGroup();
    return tv({
      extend: dynamicFocusGroup,
      base: typeof additionalClasses === "string" ? additionalClasses : "",
    });
  };
};

export const createDynamicFocusInput = (additionalClasses?: ClassValue) => {
  return () => {
    const dynamicFocusInput = useDynamicFocusInput();
    return tv({
      extend: dynamicFocusInput,
      base: typeof additionalClasses === "string" ? additionalClasses : "",
    });
  };
};

export const useDynamicFocus = () => ({
  ring: useDynamicFocusRing(),
  group: useDynamicFocusGroup(),
  input: useDynamicFocusInput(),
});
