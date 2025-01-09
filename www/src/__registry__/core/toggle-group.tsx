"use client";

import type { ToggleButtonGroupProps } from "react-aria-components";
import { ToggleButtonGroup, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";

const toggleGroupStyles = tv({
  base: "flex gap-1",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-start",
    },
  },
});

interface ToggleGroupProps extends ToggleButtonGroupProps {
  ref?: React.RefObject<HTMLDivElement>;
}
const ToggleGroup = ({
  className,
  orientation = "horizontal",
  ref,
  ...props
}: ToggleGroupProps) => {
  return (
    <ToggleButtonGroup
      ref={ref}
      orientation={orientation}
      className={composeRenderProps(className, (className, renderProps) =>
        toggleGroupStyles({
          ...renderProps,
          orientation,
          className,
        })
      )}
      {...props}
    />
  );
};

export type { ToggleGroupProps };
export { ToggleGroup };
