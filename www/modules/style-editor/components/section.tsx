"use client";

import { cn } from "@dotui/registry/lib/utils";

interface StyleEditorSectionProps extends React.ComponentProps<"div"> {
  title: string;
  rootClassName?: string;
}

export function StyleEditorSection({
  title,
  children,
  rootClassName,
  className,
  ...props
}: StyleEditorSectionProps) {
  return (
    <div className={cn("space-y-2", rootClassName)} {...props}>
      <h2 className="text-base font-semibold">{title}</h2>
      <div className={cn("space-y-2", className)}>{children}</div>
    </div>
  );
}
