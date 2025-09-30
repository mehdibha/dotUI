"use client";

import { cn } from "@dotui/registry/lib/utils";

interface StyleEditorSectionProps extends React.ComponentProps<"div"> {
  title: string;
}

export function StyleEditorSection({
  title,
  children,
  className,
  ...props
}: StyleEditorSectionProps) {
  return (
    <div className={cn("not-first:mt-6", className)} {...props}>
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </div>
  );
}
