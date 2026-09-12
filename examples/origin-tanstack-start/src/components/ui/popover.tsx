"use client";

import type React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as PopoverPrimitives from "react-aria-components/Popover";
import { useSlottedContext } from "react-aria-components/slots";

import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerHandle } from "@/components/ui/drawer";
import { tv } from "tailwind-variants";

const popoverVariants = tv({
  slots: {
    popover:
      "popover z-50 min-w-[max(var(--trigger-width),--spacing(32))] origin-(--trigger-anchor-point) rounded-lg border border-(--overlay-border) bg-popover shadow-[var(--shadow-popover,var(--shadow-md))] [backdrop-filter:var(--overlay-backdrop-filter,none)] forced-color-adjust-none outline-none [--surface-radius:var(--popover-radius)] transition-[transform,opacity,scale] duration-enter ease-enter will-change-[transform,opacity,scale] exiting:duration-exit exiting:ease-out motion-reduce:transition-none entering:scale-95 entering:opacity-0 exiting:scale-95 exiting:opacity-0 [--slide-offset:--spacing(0.5)] entering:transform-(--origin) exiting:transform-(--origin) placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))] placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]",
    arrow:
      "block [&>svg]:size-2.5 [&>svg]:fill-popover [&>svg]:stroke-border placement-left:-ml-px placement-right:-mr-px placement-top:-mt-px placement-bottom:-mb-px placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180 hidden",
  },
});
const { popover, arrow } = popoverVariants();

interface PopoverProps extends React.ComponentProps<
  typeof PopoverPrimitives.Popover
> {
  showArrow?: boolean;
}
function Popover({
  className,
  showArrow = true,
  placement,
  ...props
}: PopoverProps) {
  const context = useSlottedContext(PopoverPrimitives.PopoverContext);
  const isMobile = useIsMobile();

  // Below the mobile line, pickers and menus slide into a bottom drawer and
  // submenus stack as nested drawers. Other non-modal popovers (a combobox
  // list) keep their anchor: the page under them stays live. Render-prop
  // children read placement and entering state, which only the popover can
  // provide.
  const isNonModal = props.isNonModal ?? context?.isNonModal;
  const isSubmenu = context?.trigger === "SubmenuTrigger";
  if (
    isMobile &&
    (!isNonModal || isSubmenu) &&
    typeof props.children !== "function"
  ) {
    return (
      <Drawer
        isOpen={props.isOpen}
        defaultOpen={props.defaultOpen}
        onOpenChange={props.onOpenChange}
      >
        <DrawerHandle />
        {props.children}
      </Drawer>
    );
  }

  return (
    <PopoverPrimitives.Popover
      data-popover=""
      className={composeRenderProps(className, (className) =>
        popover({ className }),
      )}
      placement={placement}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          {showArrow && <PopoverArrow />}
        </>
      ))}
    </PopoverPrimitives.Popover>
  );
}

interface PopoverArrowProps extends React.ComponentProps<"svg"> {}
function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  return (
    <PopoverPrimitives.OverlayArrow
      data-slot="popover-arrow"
      className={arrow({ className })}
    >
      <svg
        aria-hidden="true"
        width={12}
        height={12}
        viewBox="0 0 8 8"
        {...props}
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </PopoverPrimitives.OverlayArrow>
  );
}

export type { PopoverProps };
export { Popover };
