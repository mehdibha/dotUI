import Link from "next/link";

import { cn } from "@dotui/registry/lib/utils";
import { Badge } from "@dotui/registry/ui/badge";

import { siteConfig } from "@/config";

export const Logo = ({
  extanded = true,
  className,
  type = "link",
}: {
  extanded?: boolean;
  className?: string;
  type?: "link" | "span";
}) => {
  const content = (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="size-5"
      >
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          rx="12"
          ry="12"
          className="fill-[#381e1e] dark:fill-white"
        />
        <circle
          cx="75"
          cy="75"
          r="11"
          className="fill-[#fff] dark:fill-[#381e1e]"
        />
      </svg>
      {extanded && (
        <div className="group-data-collapsed/sidebar:opacity-0 flex items-center gap-2 duration-150">
          <div className="font-josefin mt-1.5 text-base font-bold leading-normal tracking-tighter transition-colors">
            {siteConfig.name}
          </div>
          <Badge size="sm" className="mt-px">
            beta
          </Badge>
        </div>
      )}
    </>
  );

  if (type === "link") {
    return (
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2 opacity-100 transition-opacity duration-150 ease-out hover:opacity-80",
          className,
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={cn("flex items-center gap-2", className)}>{content}</span>
  );
};
