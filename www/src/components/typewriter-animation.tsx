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
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = React.useState({ left: 0, top: 0 });

  React.useEffect(() => {
    const updateCursorPosition = () => {
      if (targetRef.current && cursorRef.current && canvasRef.current) {
        const text = targetRef.current.textContent || '';
        const style = getComputedStyle(targetRef.current);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context) {
          // Set canvas size
          canvas.width = targetRef.current.offsetWidth;
          canvas.height = targetRef.current.offsetHeight;
          
          // Clear canvas
          context.clearRect(0, 0, canvas.width, canvas.height);
          
          // Set font and draw text
          context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          context.fillStyle = 'rgba(255, 255, 255, 255)'; // Semi-transparent blue
          context.fillText(text, 0, canvas.height / 2);
          
          // Draw line at measured text width
          const textWidth = context.measureText(text).width;
          context.beginPath();
          context.moveTo(textWidth, 0);
          context.lineTo(textWidth, canvas.height);
          context.strokeStyle = 'red';
          context.stroke();

          // Adjust for letter spacing
          const adjustedWidth = textWidth + parseFloat(style.letterSpacing);
          setPosition({
            left: adjustedWidth,
            top: 0,
          });
        }
      }
    };

    updateCursorPosition();
    window.addEventListener("resize", updateCursorPosition);

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
    <>
      <span
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 h-full w-[2px] rounded-full bg-[#706c6c] transition-transform duration-100 ease-linear will-change-transform"
        style={{ transform: `translateX(${position.left}px)` }}
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
        style={{ zIndex: 1000 , width: `${position.left}px` }}
      />
    </>
  );
};
