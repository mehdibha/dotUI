"use client";

import { cn } from "@dotui/ui/lib/utils";

interface EditorSectionProps extends React.ComponentProps<"div"> {
  title: string;
}

export function EditorSection({
  title,
  children,
  className,
  ...props
}: EditorSectionProps) {
  return (
    <div className={cn("not-first:mt-6", className)} {...props}>
      <p className="text-base font-semibold">{title}</p>
      
      {children}
    </div>
  );
}
