import type { ColorThumbProps as AriaColorThumbProps } from "react-aria-components";

export interface ColorThumbProps extends Omit<AriaColorThumbProps, "className"> {
  className?: string;
}

