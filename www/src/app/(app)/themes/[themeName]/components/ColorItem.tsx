import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorItemProps {
  containerClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  colorValue?: string;
  colorName?: string;
}

export function ColorItem({
  containerClassName,
  className,
  style,
  colorValue = "#000000",
  colorName,
}: ColorItemProps) {
  const [isCopied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(colorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "not-last:-mr-4 not-first:-ml-4 relative h-12 flex-1",
        containerClassName
      )}
      aria-label={`Copy ${colorName || colorValue} color value`}
    >
      <div
        className={cn(
          "hover:h-22 duration-250 group absolute bottom-0 left-0 h-12 w-full cursor-pointer overflow-hidden rounded-t-2xl transition-[height]",
          className
        )}
        style={style}
      >
        <div
          className={cn(
            "flex items-center justify-between p-2 text-sm opacity-0 transition-opacity group-hover:opacity-100",
            isCopied && "opacity-0!"
          )}
        >
          <p>{colorName || "Color"}</p>
          <p>{colorValue}</p>
        </div>
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity",
            isCopied && "opacity-100"
          )}
        >
          <CheckIcon className="text-fg-muted size-4" />
        </div>
      </div>
    </button>
  );
}
