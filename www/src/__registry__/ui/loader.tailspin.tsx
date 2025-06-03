"use client";

import type { ProgressBarProps } from "react-aria-components";
import React from "react";
import { ProgressBar as AriaProgressBar } from "react-aria-components";

interface LoaderProps extends ProgressBarProps {
  size?: number;
}

function Loader({ size = 40, ...props }: LoaderProps) {
  return (
    <AriaProgressBar {...props} isIndeterminate>
      <div
        className="relative flex animate-spin items-center justify-start rounded-full"
        style={
          {
            "--size": `${size}px`,
            "--color": "currentColor",
            "--stroke": `${size / 10}px`,
            "--mask-size": "calc(var(--size) / 2 - var(--stroke))",
            width: "var(--size)",
            height: "var(--size)",
            WebkitMask:
              "radial-gradient(circle var(--mask-size), transparent 99%, #000 100%)",
            mask: "radial-gradient(circle var(--mask-size), transparent 99%, #000 100%)",
            backgroundImage: "conic-gradient(transparent 25%, var(--color))",
          } as React.CSSProperties
        }
      ></div>
    </AriaProgressBar>
  );
}

export type { LoaderProps };
export { Loader };

{
  /* <div class="container"></div>

<style>
  .container {
    --uib-size: 40px;
    --uib-color: black;
    --uib-speed: .9s;
    --uib-stroke: 5px;
    --mask-size: calc(var(--uib-size) / 2 - var(--uib-stroke));
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: var(--uib-size);
    width: var(--uib-size);
    -webkit-mask: radial-gradient(
      circle var(--mask-size),
      transparent 99%,
      #000 100%
    );
    mask: radial-gradient(circle var(--mask-size), transparent 99%, #000 100%);
    background-image: conic-gradient(transparent 25%, var(--uib-color));
    animation: spin calc(var(--uib-speed)) linear infinite;
    border-radius: 50%;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
 */
}
