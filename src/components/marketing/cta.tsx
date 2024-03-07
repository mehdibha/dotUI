import React from "react";
import Link from "next/link";
import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/classes";

interface CallToActionProps {
  logo?: boolean;
  className?: string;
}

export const CallToAction = (props: CallToActionProps) => {
  const { className } = props;
  return (
    <section className={cn("px-6 text-center", className)}>
      <Link
        href="/"
        className={cn(
          "mr-8 inline-flex items-center space-x-3 transition-all duration-300 hover:opacity-80"
        )}
        suppressHydrationWarning
      >
        <CopyIcon size={25} />
        <span className="inline-block text-lg font-bold">rCopy</span>
      </Link>
      <h2 className="mx-auto max-w-2xl text-5xl font-bold leading-[75px]">
        Proudly open-source
      </h2>
      <p className="mt-2 text-lg text-muted-foreground">subheadline</p>
      <Button variant="default" size="lg" className="mt-12">
        Star on GitHub
      </Button>
    </section>
  );
};
