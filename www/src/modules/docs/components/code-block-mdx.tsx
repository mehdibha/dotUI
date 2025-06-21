"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/scroll-area";
import { useCopyButton } from "@/hooks/use-copy-button";
import { Check, Copy } from "lucide-react";

import type { ButtonProps } from "@dotui/ui/components/button";
import { Button } from "@dotui/ui/components/button";
import { cn } from "@dotui/ui/lib/utils";

export type CodeBlockProps = HTMLAttributes<HTMLElement> & {
  icon?: ReactNode;
  allowCopy?: boolean;
  keepBackground?: boolean;
};

export const Pre = forwardRef<HTMLPreElement, HTMLAttributes<HTMLPreElement>>(
  ({ className, ...props }, ref) => {
    return (
      <CodeBlock {...props}>
        <pre
          ref={ref}
          className={cn("max-h-[400px] p-4 [&_code]:bg-transparent", className)}
          {...props}
        >
          {props.children}
        </pre>
      </CodeBlock>
    );
  },
);

Pre.displayName = "Pre";

export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(
  (
    {
      title,
      allowCopy = true,
      keepBackground = false,
      icon,
      className,
      ...props
    },
    ref,
  ) => {
    const areaRef = useRef<HTMLDivElement>(null);
    const onCopy = useCallback(() => {
      const pre = areaRef.current?.getElementsByTagName("pre").item(0);

      if (!pre) return;

      const clone = pre.cloneNode(true) as HTMLElement;
      clone.querySelectorAll(".nd-copy-ignore").forEach((node) => {
        node.remove();
      });

      void navigator.clipboard.writeText(clone.textContent ?? "");
    }, []);

    return (
      <figure
        ref={ref}
        className={cn(
          "not-prose fd-codeblock bg-fd-secondary/50 bg-bg-muted/30 group relative my-6 overflow-hidden rounded-lg border text-sm",
          keepBackground &&
            "bg-[var(--shiki-light-bg)] dark:bg-[var(--shiki-dark-bg)]",
          className,
        )}
        {...props}
      >
        {title ? (
          <div className="bg-bg-muted flex flex-row items-center gap-2 border-b px-4 py-1.5">
            {icon ? (
              <div
                className="text-fd-muted-foreground [&_svg]:size-3.5"
                {...(typeof icon === "string"
                  ? {
                      dangerouslySetInnerHTML: { __html: icon },
                    }
                  : {
                      children: icon,
                    })}
              />
            ) : null}
            <figcaption className="text-fd-muted-foreground flex-1 truncate">
              {title}
            </figcaption>
            {allowCopy ? (
              <CopyButton className="-me-2" onCopy={onCopy} />
            ) : null}
          </div>
        ) : (
          allowCopy && (
            <CopyButton
              className="absolute top-2 right-2 z-2 backdrop-blur-sm"
              onCopy={onCopy}
            />
          )
        )}
        <ScrollArea scrollbars="both" ref={areaRef} dir="ltr">
          {props.children}
        </ScrollArea>
      </figure>
    );
  },
);

CodeBlock.displayName = "CodeBlock";

function CopyButton({
  className,
  onCopy,
  ...props
}: ButtonProps & { onCopy: () => void }) {
  const [checked, onClick] = useCopyButton(onCopy);

  return (
    <Button
      variant="quiet"
      size="sm"
      shape="square"
      className={cn(
        "transition-all group-hover:opacity-100 [&_svg]:size-3.5",
        !checked && "opacity-0",
        className,
      )}
      aria-label="Copy Text"
      onPress={onClick}
      {...props}
    >
      <Check className={cn("transition-transform", !checked && "scale-0")} />
      <Copy
        className={cn("absolute transition-transform", checked && "scale-0")}
      />
    </Button>
  );
}
