import type { ComponentType } from "react";

import { InteractiveDemoClient } from "./interactive-demo.client";
import type { Control } from "./types";

/**
 * Interactive demo component for documentation.
 * Renders a playground component with controls and live code output.
 *
 * Usage:
 * ```tsx
 * <InteractiveDemo
 *   component={ButtonPlayground}
 *   controls={buttonControls}
 * />
 * ```
 */

export interface InteractiveDemoProps {
  /** The playground component to render */
  component: ComponentType<Record<string, unknown>>;
  /** Controls definition array */
  controls: Control[];
  /** Additional className */
  className?: string;
}

export function InteractiveDemo({
  component,
  controls,
  className,
}: InteractiveDemoProps) {
  return (
    <InteractiveDemoClient
      component={component}
      controls={controls}
      className={className}
    />
  );
}
