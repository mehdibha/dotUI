"use client";

import React from "react";

const text = "Scaffold. implement. ship.";
const duration = 60;

export const TypewriterAnimation = () => {
  const ref = React.useRef<HTMLHeadingElement>(null);
  const [displayedText, setDisplayedText] = React.useState<string>("");
  const [i, setI] = React.useState<number>(0);

  React.useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [i]);

  return (
    <>
      <h1
        
        className="font-heading xs:text-2xl relative text-pretty text-xl font-semibold tracking-tighter sm:text-3xl md:text-4xl"
      >
        <span ref={ref}>{displayedText}</span>
        <Cursor targetRef={ref} />
        <span className="opacity-0">H</span>
      </h1>
    </>
  );
};

const Cursor = ({ targetRef }: { targetRef: React.RefObject<HTMLElement> }) => {
  const cursorRef = React.useRef(null);
  const [position, setPosition] = React.useState({ left: 0, top: 0 });

  React.useEffect(() => {
    const updateCursorPosition = () => {
      if (targetRef.current && cursorRef.current) {
        const targetRect = targetRef.current.getBoundingClientRect();
        const text = targetRef.current.textContent;
        const textWidth = getTextWidth(
          text as string,
          getComputedStyle(targetRef.current).font
        );
        if (textWidth) {
          setPosition({
            left: textWidth,
            top: 0,
          });
        }
      }
    };

    updateCursorPosition();
    window.addEventListener("resize", updateCursorPosition);

    // Add this line to update cursor position when text changes
    const observer = new MutationObserver(updateCursorPosition);
    if (targetRef.current) {
      observer.observe(targetRef.current, { childList: true, characterData: true, subtree: true });
    }

    return () => {
      window.removeEventListener("resize", updateCursorPosition);
      observer.disconnect();
    };
  }, [targetRef]);

  return (
    <span
      ref={cursorRef}
      className="pointer-events-none absolute left-0 top-0 h-full w-1 rounded-full bg-[#706c6c] transition-transform duration-100 ease-linear will-change-transform"
      style={{ transform: `translateX(${position.left}px)` }}
    />
  );
};

function getTextWidth(text: string, font: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.font = font;
  return context.measureText(text).width;
}
