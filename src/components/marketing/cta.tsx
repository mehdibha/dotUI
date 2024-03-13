import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/classes";

interface CallToActionProps {
  className?: string;
}

export const CallToAction = (props: CallToActionProps) => {
  const { className } = props;
  return (
    <section className={cn("px-6 text-center", className)}>
      <h2 className="mx-auto mt-8 max-w-2xl text-5xl font-bold tracking-tight">
        Proudly open source
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        rCopy is open source and free. The code is available on GitHub.
      </p>
      <div className="mt-10 flex justify-center space-x-2">
        <Button variant="secondary" size="lg">
          Star on GitHub
        </Button>
      </div>
    </section>
  );
};
