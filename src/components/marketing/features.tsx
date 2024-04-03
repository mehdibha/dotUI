import React from "react";
import { cn } from "@/lib/utils/classes";

export const Features = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <h2 className="pb-1 text-center font-display text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
        <AnimatedWord word="Copy." index={1} />
        <AnimatedWord word="Paste." index={2} />
        <AnimatedWord word="Own it." index={3} />
      </h2>
      <p className="mt-2 text-base text-muted-foreground md:mt-8 md:text-lg">
        rCopy is not another package that you need to install. We strongly believe that
        you should own your code. It&apos;s a collection of re-usable components, hooks,
        icons, pages and more that you can copy and paste into your apps, modify it as you
        like and make it yours.
      </p>
      <div className="mt-12 grid grid-cols-3 gap-8 px-20">
        {["", "", ""].map((feature, index) => (
          <div key={index} className="h-44 rounded bg-card shadow"></div>
        ))}
      </div>
    </div>
  );
};

const AnimatedWord = ({ word, index }: { word: string; index: 1 | 2 | 3 }) => {
  return (
    <span
      data-content={word}
      className={cn(
        "relative inline-block before:absolute before:bottom-0 before:left-0 before:top-0 before:inline-block before:w-full before:px-2 before:text-center before:text-foreground before:content-[attr(data-content)]",
        {
          "before:animate-gradient-background-1": index === 1,
          "before:animate-gradient-background-2": index === 2,
          "before:animate-gradient-background-3": index === 3,
        }
      )}
    >
      <span
        className={cn("bg-gradient bg-clip-text px-2 text-transparent", {
          "animate-gradient-foreground-1": index === 1,
          "animate-gradient-foreground-2": index === 2,
          "animate-gradient-foreground-3": index === 3,
        })}
      >
        {word}
      </span>
    </span>
  );
};
