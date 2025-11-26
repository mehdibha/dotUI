import type {
  TooltipTrigger as AriaTooltipTrigger,
  Tooltip as AriaTooltip,
} from "react-aria-components";

export interface TooltipProps
  extends React.ComponentProps<typeof AriaTooltipTrigger> {}

export interface TooltipContentProps
  extends React.ComponentProps<typeof AriaTooltip> {
  /**
   * Whether to hide the tooltip arrow.
   * @default false
   */
  hideArrow?: boolean;
}

