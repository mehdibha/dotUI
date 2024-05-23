import React from "react";
import {
  animate,
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { OverlayTriggerStateContext } from "react-aria-components";

const inertiaTransition = {
  type: "inertia" as const,
  bounceStiffness: 300,
  bounceDamping: 40,
  timeConstant: 300,
};
const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};
const SHEET_MARGIN = 34;
const SHEET_RADIUS = 12;

const useMotionDrawer = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { isOpen, setOpen } = React.useContext(OverlayTriggerStateContext);

  const h = window.innerHeight - SHEET_MARGIN;
  const y = useMotionValue(h);
  const bgOpacity = useTransform(y, [0, h], [0.4, 0]);

  // Scale the body down and adjust the border radius when the sheet is open.
  const bodyScale = useTransform(
    y,
    [0, h],
    [(window.innerWidth - SHEET_MARGIN) / window.innerWidth, 1]
  );
  const bodyTranslate = useTransform(y, [0, h], [SHEET_MARGIN - SHEET_RADIUS, 0]);
  const bodyBorderRadius = useTransform(y, [0, h], [SHEET_RADIUS, 0]);

  useMotionValueEvent(bodyScale, "change", (v) => {
    const wrapper: HTMLElement = document.querySelector("[drawer-wrapper]")!;
    wrapper.style.scale = `${v}`;
  });
  useMotionValueEvent(bodyTranslate, "change", (v) => {
    const wrapper: HTMLElement = document.querySelector("[drawer-wrapper]")!;
    wrapper.style.translate = `0 ${v}px`;
  });
  useMotionValueEvent(bodyBorderRadius, "change", (v) => {
    const wrapper: HTMLElement = document.querySelector("[drawer-wrapper]")!;
    wrapper.style.borderRadius = `${v}px`;
  });

  const overlayProps = {
    isOpen: true,
    onOpenChange: setOpen,
  };

  const backdropProps = {
    style: { opacity: bgOpacity as unknown as string },
  };

  const drawerProps = {
    initial: { y: h },
    animate: { y: 0 },
    exit: { y: h },
    transition: staticTransition,
    style: {
      y,
      top: SHEET_MARGIN,
      // Extra padding at the bottom to account for rubber band scrolling.
      paddingBottom: window.screen.height,
    },
    onAnimationStart: () => {
      set(
        document.body,
        {
          background: "black",
        },
        true
      );
    },
    onAnimationEnd: () => {
      reset(document.body);
    },
    drag: "y" as const,
    dragConstraints: { top: 0 },
    onDragEnd: (
      e: MouseEvent | TouchEvent | PointerEvent,
      { offset, velocity }: PanInfo
    ) => {
      if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
        setOpen(false);
      } else {
        void animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
      }
    },
  };

  return {
    overlayProps,
    backdropProps,
    drawerProps,
  };
};

const OverlayWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = React.useContext(OverlayTriggerStateContext);

  return <AnimatePresence>{isOpen && <>{children}</>}</AnimatePresence>;
};

type Style = Record<string, string>;

const cache = new WeakMap();
function set(
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

export { OverlayWrapper, useMotionDrawer };
