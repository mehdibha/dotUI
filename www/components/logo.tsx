import { Badge } from "@dotui/ui/components/badge";
import { cn } from "@dotui/ui/lib/utils";

import { Link } from "@/components/link";
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
  const Elem = type === "link" ? Link : "span";

  return (
    <Elem
      {...(type === "link" ? { href: "/", variant: "unstyled" } : {})}
      className={cn(
        "flex items-center gap-2",
        type === "link" &&
          "opacity-100 transition-opacity duration-150 ease-out hover:opacity-80",
        className,
      )}
    >
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
        <div className="flex items-center gap-2">
          <div className="font-josefin group-data-collapsed/sidebar:opacity-0 mt-1.5 text-base font-bold leading-normal tracking-tighter transition-colors">
            {siteConfig.name}
          </div>
          {/* <Badge size="sm">Preview</Badge> */}
        </div>
      )}
    </Elem>
  );
};
