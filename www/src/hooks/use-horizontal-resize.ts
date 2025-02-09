import React from "react";

type ResizeOptions = {
  minWidth?: number;
};

export const useHorizontalResize = (options?: ResizeOptions) => {
  const { minWidth: minWidthProp = 300 } = options || {};
  const [width, setWidth] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const startWidth = React.useRef(0);

  const maxWidth = React.useRef(0);
  const minWidth = React.useRef(0);

  // Initialize width and maxWidth on mount
  React.useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setWidth(containerWidth);
      maxWidth.current = containerWidth;
      minWidth.current = Math.min(minWidthProp, containerWidth);
    }
  }, [minWidthProp]);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = containerRef.current?.offsetWidth || 0;

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = e.clientX - startX.current;
        const newWidth = Math.min(
          Math.max(minWidth.current, startWidth.current + delta),
          maxWidth.current
        );
        setWidth(newWidth);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [minWidth]
  );

  return {
    containerRef,
    width,
    handleMouseDown,
  };
};
