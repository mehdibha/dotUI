import React from "react";
import { OverlayTriggerStateContext } from "react-aria-components";

interface useMotionDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  shouldScaleBackground?: boolean;
  closeThreshold?: number;
  scrollLockTimeout?: number;
  dismissible?: boolean;
  direction?: "top" | "bottom" | "left" | "right";
}

export const useMotionDrawer = (props: useMotionDrawerProps) => {
  const {
    open: openProp,
    onOpenChange,
    shouldScaleBackground = true,
    closeThreshold = CLOSE_THRESHOLD,
    scrollLockTimeout = SCROLL_LOCK_TIMEOUT,
    dismissible = true,
    direction = "bottom",
  } = props;
  const { isOpen, setOpen } = React.useContext(OverlayTriggerStateContext);
  const [hasBeenOpened, setHasBeenOpened] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [justReleased, setJustReleased] = React.useState<boolean>(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const openTime = React.useRef<Date | null>(null);
  const dragStartTime = React.useRef<Date | null>(null);
  const dragEndTime = React.useRef<Date | null>(null);
  const lastTimeDragPrevented = React.useRef<Date | null>(null);
  const isAllowedToDrag = React.useRef<boolean>(false);
  const pointerStart = React.useRef(0);
  const keyboardIsOpen = React.useRef(false);
  const previousDiffFromInitial = React.useRef(0);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const drawerHeightRef = React.useRef(
    drawerRef.current?.getBoundingClientRect().height || 0
  );
  const initialDrawerHeight = React.useRef(0);

  const { restorePositionSetting } = usePositionFixed({
    isOpen,
    modal: true,
    nested: false,
    hasBeenOpened,
    preventScrollRestoration: true,
    noBodyStyles: false,
  });

  function getScale() {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }

  function onPress(event: React.PointerEvent<HTMLDivElement>) {
    if (!dismissible) return;
    if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) return;
    drawerHeightRef.current = drawerRef.current?.getBoundingClientRect().height || 0;
    setIsDragging(true);
    dragStartTime.current = new Date();
    if (isIOS()) {
      window.addEventListener("touchend", () => (isAllowedToDrag.current = false), {
        once: true,
      });
    }
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    pointerStart.current = isVertical(direction) ? event.clientY : event.clientX;
  }

  function shouldDrag(el: EventTarget, isDraggingInDirection: boolean) {
    let element = el as HTMLElement;
    const highlightedText = window.getSelection()?.toString();
    const swipeAmount = drawerRef.current
      ? getTranslate(drawerRef.current, direction)
      : null;
    const date = new Date();
    if (
      element.hasAttribute("data-vaul-no-drag") ||
      element.closest("[data-vaul-no-drag]")
    ) {
      return false;
    }
    if (direction === "right" || direction === "left") {
      return true;
    }
    if (openTime.current && date.getTime() - openTime.current.getTime() < 500) {
      return false;
    }
    if (swipeAmount !== null) {
      if (direction === "bottom" ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }
    if (
      lastTimeDragPrevented.current &&
      date.getTime() - lastTimeDragPrevented.current.getTime() < scrollLockTimeout &&
      swipeAmount === 0
    ) {
      lastTimeDragPrevented.current = date;
      return false;
    }
    if (isDraggingInDirection) {
      lastTimeDragPrevented.current = date;
      return false;
    }
    while (element) {
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented.current = new Date();
          return false;
        }
        if (element.getAttribute("role") === "dialog") {
          return true;
        }
      }
      element = element.parentNode as HTMLElement;
    }
    return true;
  }

  function onDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!drawerRef.current) {
      return;
    }
    if (isDragging) {
      const directionMultiplier =
        direction === "bottom" || direction === "right" ? 1 : -1;
      const draggedDistance =
        (pointerStart.current - (isVertical(direction) ? event.clientY : event.clientX)) *
        directionMultiplier;
      const isDraggingInDirection = draggedDistance > 0;
      const absDraggedDistance = Math.abs(draggedDistance);
      const wrapper = document.querySelector("[vaul-drawer-wrapper]");
      const percentageDragged = absDraggedDistance / drawerHeightRef.current;
      if (!isAllowedToDrag.current && !shouldDrag(event.target, isDraggingInDirection))
        return;
      drawerRef.current.classList.add(DRAG_CLASS);
      isAllowedToDrag.current = true;
      set(drawerRef.current, {
        transition: "none",
      });
      set(overlayRef.current, {
        transition: "none",
      });
      if (isDraggingInDirection) {
        const dampenedDraggedDistance = dampenValue(draggedDistance);
        const translateValue =
          Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
        set(drawerRef.current, {
          transform: isVertical(direction)
            ? `translate3d(0, ${translateValue}px, 0)`
            : `translate3d(${translateValue}px, 0, 0)`,
        });
        return;
      }
      const opacityValue = 1 - percentageDragged;
      set(
        overlayRef.current,
        {
          opacity: `${opacityValue}`,
          transition: "none",
        },
        true
      );
      if (wrapper && overlayRef.current && shouldScaleBackground) {
        const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
        const borderRadiusValue = 8 - percentageDragged * 8;
        const translateValue = Math.max(0, 14 - percentageDragged * 14);
        set(
          wrapper,
          {
            borderRadius: `${borderRadiusValue}px`,
            transform: isVertical(direction)
              ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)`
              : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
            transition: "none",
          },
          true
        );
      }
      const translateValue = absDraggedDistance * directionMultiplier;
      set(drawerRef.current, {
        transform: isVertical(direction)
          ? `translate3d(0, ${translateValue}px, 0)`
          : `translate3d(${translateValue}px, 0, 0)`,
      });
    }
  }

  React.useEffect(() => {
    return () => {
      scaleBackground(false);
      restorePositionSetting()
    };
  }, []);

  React.useEffect(() => {
    function onVisualViewportChange() {
      if (!drawerRef.current) return;

      const focusedElement = document.activeElement as HTMLElement;
      if (isInput(focusedElement) || keyboardIsOpen.current) {
        const visualViewportHeight = window.visualViewport?.height || 0;
        // This is the height of the keyboard
        const diffFromInitial = window.innerHeight - visualViewportHeight;
        const drawerHeight = drawerRef.current.getBoundingClientRect().height || 0;
        if (!initialDrawerHeight.current) {
          initialDrawerHeight.current = drawerHeight;
        }
        const offsetFromTop = drawerRef.current.getBoundingClientRect().top;
        if (Math.abs(previousDiffFromInitial.current - diffFromInitial) > 60) {
          keyboardIsOpen.current = !keyboardIsOpen.current;
        }
        previousDiffFromInitial.current = diffFromInitial;
        if (drawerHeight > visualViewportHeight || keyboardIsOpen.current) {
          const height = drawerRef.current.getBoundingClientRect().height;
          let newDrawerHeight = height;
          if (height > visualViewportHeight) {
            newDrawerHeight = visualViewportHeight - WINDOW_TOP_OFFSET;
          }
          if (false) {
            // fixed
            drawerRef.current.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
          } else {
            drawerRef.current.style.height = `${Math.max(
              newDrawerHeight,
              visualViewportHeight - offsetFromTop
            )}px`;
          }
        } else {
          drawerRef.current.style.height = `${initialDrawerHeight.current}px`;
        }
        drawerRef.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
      }
    }
    window.visualViewport?.addEventListener("resize", onVisualViewportChange);
    return () =>
      window.visualViewport?.removeEventListener("resize", onVisualViewportChange);
  }, []);

  function closeDrawer() {
    if (!drawerRef.current) return;
    cancelDrag();
    set(drawerRef.current, {
      transform: isVertical(direction)
        ? `translate3d(0, ${direction === "bottom" ? "100%" : "-100%"}, 0)`
        : `translate3d(${direction === "right" ? "100%" : "-100%"}, 0, 0)`,
      transition: `transform ${
        TRANSITIONS.DURATION
      }s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
    });
    set(overlayRef.current, {
      opacity: "0",
      transition: `opacity ${
        TRANSITIONS.DURATION
      }s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
    });
    scaleBackground(false);
    setTimeout(() => {
      setVisible(false);
      setOpen(false);
    }, 300);
  }

  React.useEffect(() => {
    if (!isOpen && shouldScaleBackground) {
      const id = setTimeout(() => {
        reset(document.body);
      }, 200);
      return () => clearTimeout(id);
    }
  }, [isOpen, shouldScaleBackground]);

  React.useLayoutEffect(() => {
    if (openProp) {
      setOpen(true);
      setHasBeenOpened(true);
    } else {
      closeDrawer();
    }
  }, [openProp]);

  React.useEffect(() => {
    if (mounted) {
      onOpenChange?.(isOpen);
    }
  }, [isOpen]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  function resetDrawer() {
    if (!drawerRef.current) return;
    const wrapper = document.querySelector("[vaul-drawer-wrapper]");
    const currentSwipeAmount = getTranslate(drawerRef.current, direction);

    set(drawerRef.current, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${
        TRANSITIONS.DURATION
      }s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
    });

    set(overlayRef.current, {
      transition: `opacity ${
        TRANSITIONS.DURATION
      }s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      opacity: "1",
    });

    if (shouldScaleBackground && currentSwipeAmount && currentSwipeAmount > 0 && isOpen) {
      set(
        wrapper,
        {
          borderRadius: `${BORDER_RADIUS}px`,
          overflow: "hidden",
          ...(isVertical(direction)
            ? {
                transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
                transformOrigin: "top",
              }
            : {
                transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
                transformOrigin: "left",
              }),
          transitionProperty: "transform, border-radius",
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        },
        true
      );
    }
  }

  function cancelDrag() {
    if (!isDragging || !drawerRef.current) return;
    drawerRef.current.classList.remove(DRAG_CLASS);
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = new Date();
  }

  function onRelease(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !drawerRef.current) return;
    drawerRef.current.classList.remove(DRAG_CLASS);
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = new Date();
    const swipeAmount = getTranslate(drawerRef.current, direction);
    if (!shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount))
      return;
    if (dragStartTime.current === null) return;
    const timeTaken = dragEndTime.current.getTime() - dragStartTime.current.getTime();
    const distMoved =
      pointerStart.current - (isVertical(direction) ? event.clientY : event.clientX);
    const velocity = Math.abs(distMoved) / timeTaken;
    if (velocity > 0.05) {
      setJustReleased(true);
      setTimeout(() => {
        setJustReleased(false);
      }, 200);
    }
    if (direction === "bottom" || direction === "right" ? distMoved > 0 : distMoved < 0) {
      resetDrawer();
      return;
    }
    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      return;
    }
    const visibleDrawerHeight = Math.min(
      drawerRef.current.getBoundingClientRect().height ?? 0,
      window.innerHeight
    );
    if (swipeAmount >= visibleDrawerHeight * closeThreshold) {
      closeDrawer();
      return;
    }
    resetDrawer();
  }

  React.useEffect(() => {
    if (isOpen) {
      set(document.documentElement, {
        scrollBehavior: "auto",
      });
      openTime.current = new Date();
      scaleBackground(true);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (drawerRef.current && visible) {
      const children = drawerRef?.current?.querySelectorAll("*");
      children?.forEach((child: Element) => {
        const htmlChild = child as HTMLElement;
        if (
          htmlChild.scrollHeight > htmlChild.clientHeight ||
          htmlChild.scrollWidth > htmlChild.clientWidth
        ) {
          htmlChild.classList.add("vaul-scrollable");
        }
      });
    }
  }, [visible]);

  function scaleBackground(open: boolean) {
    const wrapper = document.querySelector("[vaul-drawer-wrapper]");
    if (!wrapper || !shouldScaleBackground) return;
    if (open) {
      set(document.body, {
        background: document.body.style.backgroundColor || document.body.style.background,
      });
      set(document.body, { background: "black" }, true);
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...(isVertical(direction)
          ? {
              transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
              transformOrigin: "top",
            }
          : {
              transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
              transformOrigin: "left",
            }),
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      });
    } else {
      // Exit
      reset(wrapper, "overflow");
      reset(wrapper, "transform");
      reset(wrapper, "borderRadius");
      set(wrapper, {
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      });
    }
  }

  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const wasBeyondThePointRef = React.useRef(false);

  const isDeltaInDirection = (
    delta: { x: number; y: number },
    direction: DrawerDirection,
    threshold = 0
  ) => {
    if (wasBeyondThePointRef.current) return true;

    const deltaY = Math.abs(delta.y);
    const deltaX = Math.abs(delta.x);
    const isDeltaX = deltaX > deltaY;
    const dFactor = ["bottom", "right"].includes(direction) ? 1 : -1;

    if (direction === "left" || direction === "right") {
      const isReverseDirection = delta.x * dFactor < 0;
      if (!isReverseDirection && deltaX >= 0 && deltaX <= threshold) {
        return isDeltaX;
      }
    } else {
      const isReverseDirection = delta.y * dFactor < 0;
      if (!isReverseDirection && deltaY >= 0 && deltaY <= threshold) {
        return !isDeltaX;
      }
    }

    wasBeyondThePointRef.current = true;
    return true;
  };

  React.useEffect(() => {
    console.log("drawerRef", drawerRef.current);
    if (!drawerRef.current) return;
    drawerRef.current.addEventListener("pointerdown", (e) => {
      console.log("pointerdown");
    });
  }, [drawerRef]);

  const rootProps = { value: { visible, setVisible } };

  const drawerProps = {
    ref: drawerRef,
    "data-drawer": "",
    "data-direction": direction,
    "data-visible": visible ? "true" : "false",
    onPointerDown: (event) => {
      pointerStartRef.current = { x: event.clientX, y: event.clientY };
      onPress(event);
    },
    onPointerMove: (event) => {
      if (!pointerStartRef.current) return;
      const yPosition = event.clientY - pointerStartRef.current.y;
      const xPosition = event.clientX - pointerStartRef.current.x;

      const swipeStartThreshold = event.pointerType === "touch" ? 10 : 2;
      const delta = { x: xPosition, y: yPosition };

      const isAllowedToSwipe = isDeltaInDirection(delta, direction, swipeStartThreshold);
      if (isAllowedToSwipe) onDrag(event);
      else if (
        Math.abs(xPosition) > swipeStartThreshold ||
        Math.abs(yPosition) > swipeStartThreshold
      ) {
        pointerStartRef.current = null;
      }
    },
    onPointerUp: (event) => {
      pointerStartRef.current = null;
      wasBeyondThePointRef.current = false;
      onRelease(event);
    },
  };

  const modalProps = {
    isOpen,
    onOpenChange: (o: boolean) => {
      if (openProp !== undefined) {
        onOpenChange?.(o);
        return;
      }
      if (!o) {
        closeDrawer();
      } else {
        setHasBeenOpened(true);
        setOpen(o);
      }
    },
  };

  const backdropProps = {
    ref: overlayRef,
    "aria-hidden": true,
    "data-overlay": "",
    "data-visible": visible ? "true" : "false",
  };

  return {
    rootProps,
    modalProps,
    drawerProps,
    backdropProps,
  };
};

export const MotionDrawerRoot = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DrawerInternalContextValue;
}) => {
  return (
    <DrawerInternalContext.Provider value={value}>
      {children}
    </DrawerInternalContext.Provider>
  );
};

export const MotionDrawerContent = ({ children }: { children: React.ReactNode }) => {
  const { setVisible } = useDrawerInternalContext();

  React.useEffect(() => {
    setVisible(true);
  }, [setVisible]);

  return children;
};

interface DrawerInternalContextValue {
  visible: boolean;
  setVisible: (o: boolean) => void;
}

export const DrawerInternalContext =
  React.createContext<DrawerInternalContextValue | null>(null);

export const useDrawerInternalContext = () => {
  const context = React.useContext(DrawerInternalContext);
  if (!context) {
    throw new Error("useDrawerInternalContext must be used within a MotionDrawerRoot");
  }
  return context;
};

// usePositionFixed

let previousBodyPosition: Record<string, string> | null = null;

export function usePositionFixed({
  isOpen,
  modal,
  nested,
  hasBeenOpened,
  preventScrollRestoration,
  noBodyStyles,
}: {
  isOpen: boolean;
  modal: boolean;
  nested: boolean;
  hasBeenOpened: boolean;
  preventScrollRestoration: boolean;
  noBodyStyles: boolean;
}) {
  const [activeUrl, setActiveUrl] = React.useState(() =>
    typeof window !== "undefined" ? window.location.href : ""
  );
  const scrollPos = React.useRef(0);

  const setPositionFixed = React.useCallback(() => {
    // If previousBodyPosition is already set, don't set it again.
    if (previousBodyPosition === null && isOpen && !noBodyStyles) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
        right: "unset",
      };

      // Update the dom inside an animation frame
      const { scrollX, innerHeight } = window;

      document.body.style.setProperty("position", "fixed", "important");
      Object.assign(document.body.style, {
        top: `${-scrollPos.current}px`,
        left: `${-scrollX}px`,
        right: "0px",
        height: "auto",
      });

      window.setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            // Attempt to check if the bottom bar appeared due to the position change
            const bottomBarHeight = innerHeight - window.innerHeight;
            if (bottomBarHeight && scrollPos.current >= innerHeight) {
              // Move the content further up so that the bottom bar doesn't hide it
              document.body.style.top = `${-(scrollPos.current + bottomBarHeight)}px`;
            }
          }),
        300
      );
    }
  }, [isOpen]);

  const restorePositionSetting = React.useCallback(() => {
    if (previousBodyPosition !== null && !noBodyStyles) {
      // Convert the position from "px" to Int
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);

      // Restore styles
      Object.assign(document.body.style, previousBodyPosition);

      window.requestAnimationFrame(() => {
        if (preventScrollRestoration && activeUrl !== window.location.href) {
          setActiveUrl(window.location.href);
          return;
        }

        window.scrollTo(x, y);
      });

      previousBodyPosition = null;
    }
  }, [activeUrl]);

  React.useEffect(() => {
    function onScroll() {
      scrollPos.current = window.scrollY;
    }

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  React.useEffect(() => {
    if (nested || !hasBeenOpened) return;
    // This is needed to force Safari toolbar to show **before** the drawer starts animating to prevent a gnarly shift from happening
    if (isOpen) {
      // avoid for standalone mode (PWA)
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      !isStandalone && setPositionFixed();

      if (!modal) {
        window.setTimeout(() => {
          restorePositionSetting();
        }, 500);
      }
    } else {
      restorePositionSetting();
    }
  }, [
    isOpen,
    hasBeenOpened,
    activeUrl,
    modal,
    nested,
    setPositionFixed,
    restorePositionSetting,
  ]);

  return { restorePositionSetting };
}

// Constants

const CLOSE_THRESHOLD = 0.25;
const SCROLL_LOCK_TIMEOUT = 100;
const BORDER_RADIUS = 8;
const WINDOW_TOP_OFFSET = 26;
const DRAG_CLASS = "vaul-dragging";
const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1],
};
const VELOCITY_THRESHOLD = 0.4;

// Types

type DrawerDirection = "top" | "bottom" | "left" | "right";

// Helpers

interface Style {
  [key: string]: string;
}

const cache = new WeakMap();

export function isInView(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();

  if (!window.visualViewport) return false;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    // Need + 40 for safari detection
    rect.bottom <= window.visualViewport.height - 40 &&
    rect.right <= window.visualViewport.width
  );
}

export function set(
  el: Element | HTMLElement | null | undefined,
  styles: Style,
  ignoreCache = false
) {
  if (!el || !(el instanceof HTMLElement)) return;
  let originalStyles: Style = {};

  Object.entries(styles).forEach(([key, value]: [string, string]) => {
    if (key.startsWith("--")) {
      el.style.setProperty(key, value);
      return;
    }

    originalStyles[key] = (el.style as any)[key];
    (el.style as any)[key] = value;
  });

  if (ignoreCache) return;

  cache.set(el, originalStyles);
}

export function reset(el: Element | HTMLElement | null, prop?: string) {
  if (!el || !(el instanceof HTMLElement)) return;
  let originalStyles = cache.get(el);

  if (!originalStyles) {
    return;
  }

  if (prop) {
    (el.style as any)[prop] = originalStyles[prop];
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      (el.style as any)[key] = value;
    });
  }
}

export const isVertical = (direction: DrawerDirection) => {
  switch (direction) {
    case "top":
    case "bottom":
      return true;
    case "left":
    case "right":
      return false;
    default:
      return direction satisfies never;
  }
};

export function getTranslate(
  element: HTMLElement,
  direction: DrawerDirection
): number | null {
  if (!element) {
    return null;
  }
  const style = window.getComputedStyle(element);
  const transform =
    // @ts-ignore
    style.transform || style.webkitTransform || style.mozTransform;
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d
    return parseFloat(mat[1].split(", ")[isVertical(direction) ? 13 : 12]);
  }
  // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(", ")[isVertical(direction) ? 5 : 4]) : null;
}

export function dampenValue(v: number) {
  return 8 * (Math.log(v + 1) - 2);
}

// Additional helpers

function testPlatform(re: RegExp): boolean | undefined {
  return typeof window !== "undefined" && window.navigator != null
    ? re.test(window.navigator.platform)
    : undefined;
}

function isMac(): boolean | undefined {
  return testPlatform(/^Mac/);
}

function isIPhone(): boolean | undefined {
  return testPlatform(/^iPhone/);
}

function isIPad(): boolean | undefined {
  return (
    testPlatform(/^iPad/) ||
    // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
    (isMac() && navigator.maxTouchPoints > 1)
  );
}

function isIOS(): boolean | undefined {
  return isIPhone() || isIPad();
}

const nonTextInputTypes = new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset",
]);
function isInput(target: Element) {
  return (
    (target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type)) ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}
