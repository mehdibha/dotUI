import React from "react";

interface ResizeOptions {
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
  edge?: "left" | "right";
  onResize?: (info: {
    newWidth: number;
    delta: number;
    startX: number;
    clientX: number;
    startWidth: number;
    edge: "left" | "right";
  }) => void;
}

export const useHorizontalResize = (options?: ResizeOptions) => {
  const {
    minWidth: minWidthProp = 300,
    initialWidth,
    edge = "right",
    onResize,
  } = options || {};
  const [width, setWidth] = React.useState<number | null>(initialWidth || null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const startX = React.useRef(0);
  const startWidth = React.useRef(0);

  const maxWidth = React.useRef(options?.maxWidth ?? 0);
  const minWidth = React.useRef(options?.minWidth ?? 0);

  // Initialize width and maxWidth on mount
  React.useEffect(() => {
    if (containerRef.current && !initialWidth) {
      const containerWidth = containerRef.current.offsetWidth;
      setWidth(containerWidth);
      maxWidth.current = containerWidth;
      minWidth.current = Math.min(minWidthProp, containerWidth);
    }
  }, [minWidthProp, initialWidth]);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      setIsDragging(true);
      startX.current = e.clientX;
      startWidth.current = containerRef.current?.offsetWidth || 0;

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const overlay = document.createElement("div");
      overlay.setAttribute("data-horizontal-resize-overlay", "");
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.cursor = "col-resize";
      overlay.style.zIndex = "2147483647";
      overlay.style.background = "transparent";
      document.body.appendChild(overlay);

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const sign = edge === "left" ? -1 : 1;
        const delta = sign * (e.clientX - startX.current);
        const newWidth = Math.min(
          Math.max(minWidth.current, startWidth.current + delta),
          maxWidth.current,
        );
        setWidth(newWidth);
        onResize?.({
          newWidth,
          delta,
          startX: startX.current,
          clientX: e.clientX,
          startWidth: startWidth.current,
          edge,
        });
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [edge, onResize],
  );

  return {
    containerRef,
    width,
    setWidth,
    handleMouseDown,
    isDragging,
  };
};
