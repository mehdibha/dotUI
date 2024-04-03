import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/classes";
import { siteConfig } from "@/config";
import { GitHubIcon } from "../icons";

interface CallToActionProps {
  className?: string;
}

export const CallToAction = (props: CallToActionProps) => {
  const { className } = props;
  const stars = 3; // TODO: make this dynamic

  return (
    <section className={cn("mx-auto max-w-2xl px-6 text-center", className)}>
      <h2 className="mx-auto mt-8 max-w-2xl text-3xl font-bold tracking-tighter lg:text-5xl">
        Proudly open-source
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Our source code is available on GitHub - feel free to read, review, or contribute
        to it however you want!
      </p>
      <div className="mt-10 flex justify-center space-x-2">
        {stars && (
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="group flex"
          >
            <div className="flex h-10 items-center justify-center space-x-2 rounded-md bg-secondary px-4 text-secondary-foreground group-hover:bg-secondary/80">
              <GitHubIcon size={18} />
              <span>Star us on GitHub</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-secondary border-y-transparent group-hover:border-secondary/80 group-hover:border-y-transparent " />
              <div className="flex h-10 items-center rounded-md bg-secondary px-4 font-medium text-secondary-foreground group-hover:bg-secondary/80">
                {stars}
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
};
