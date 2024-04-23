"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn, cva } from "@/lib/utils/classes";

type DrawerContext = {
  direction: "top" | "bottom" | "left" | "right";
  showSwipeBar: boolean;
};

type DrawerRootProps = React.ComponentProps<typeof DrawerPrimitive.Root> & {
  showSwipeBar?: boolean;
};

const DrawerContext = React.createContext<DrawerContext | null>(null);

function useDrawerContext() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a <DrawerRoot />");
  }
  return context;
}

const DrawerRoot = (_props: DrawerRootProps) => {
  const {
    shouldScaleBackground = true,
    direction = "bottom",
    showSwipeBar = true,
    ...props
  } = _props;
  return (
    <DrawerContext.Provider value={{ direction, showSwipeBar }}>
      <DrawerPrimitive.Root
        direction={direction}
        shouldScaleBackground={shouldScaleBackground}
        {...props}
      />
    </DrawerContext.Provider>
  );
};
DrawerRoot.displayName = "DrawerRoot";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const drawerVariants = cva("fixed z-50 flex h-auto border bg-background", {
  variants: {
    direction: {
      top: "top-0 inset-x-0 rounded-b-[10px] mb-24 flex-col-reverse",
      bottom: "bottom-0 inset-x-0 rounded-t-[10px] mt-24 flex-col",
      left: "left-0 inset-y-0 rounded-r-[10px] mr-24 flex-row-reverse",
      right: "right-0 inset-y-0 rounded-l-[10px] ml-24 flex-row",
    },
  },
  defaultVariants: {
    direction: "bottom",
  },
});

const swipeBarVariants = cva("rounded-full bg-bg-muted", {
  variants: {
    direction: {
      top: "mx-auto mb-4 h-2 w-[100px]",
      bottom: "mx-auto mt-4 h-2 w-[100px]",
      left: "my-auto mr-4 w-2 h-[100px]",
      right: "my-auto ml-4 w-2 h-[100px]",
    },
  },
});

type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({ className, children, ...props }, ref) => {
  const { direction, showSwipeBar } = useDrawerContext();
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(drawerVariants({ direction }), className)}
        {...props}
      >
        {showSwipeBar && <div className={cn(swipeBarVariants({ direction }))} />}
        <div>{children}</div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

type DrawerProps = DrawerRootProps & DrawerContentProps;

const Drawer = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerProps
>(
  (
    {
      className,
      children,
      open,
      onOpenChange,
      direction,
      snapPoints,
      fadeFromIndex,
      activeSnapPoint,
      setActiveSnapPoint,
      closeThreshold,
      shouldScaleBackground,
      scrollLockTimeout,
      fixed,
      dismissible,
      onDrag,
      onRelease,
      modal,
      nested,
      onClose,
      preventScrollRestoration,
      showSwipeBar,
      ...DrawerContentprops
    },
    ref
  ) => {
    const additionalRootProps = snapPoints ? { snapPoints, fadeFromIndex } : {};
    return (
      <DrawerRoot
        direction={direction}
        open={open}
        onOpenChange={onOpenChange}
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
        closeThreshold={closeThreshold}
        shouldScaleBackground={shouldScaleBackground}
        scrollLockTimeout={scrollLockTimeout}
        fixed={fixed}
        dismissible={dismissible}
        onDrag={onDrag}
        onRelease={onRelease}
        modal={modal}
        nested={nested}
        onClose={onClose}
        preventScrollRestoration={preventScrollRestoration}
        showSwipeBar={showSwipeBar}
        {...additionalRootProps}
      >
        <DrawerContent ref={ref} className={className} {...DrawerContentprops}>
          {children}
        </DrawerContent>
      </DrawerRoot>
    );
  }
);
Drawer.displayName = "Drawer";

export { Drawer, DrawerRoot, DrawerTrigger, DrawerClose, DrawerContent };
