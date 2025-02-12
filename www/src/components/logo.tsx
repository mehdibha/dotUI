import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";

export const Logo = ({
  extanded = true,
  className,
}: {
  extanded?: boolean;
  className?: string;
}) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 rounded-sm opacity-100 transition-opacity duration-150 ease-out hover:opacity-80",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 300"
        className="rounded-xs size-5"
      >
        <defs>
          <clipPath id="a">
            <path d="M24 0h252c13.254 0 24 10.746 24 24v252c0 13.254-10.746 24-24 24H24c-13.254 0-24-10.746-24-24V24C0 10.746 10.746 0 24 0Zm0 0" />
          </clipPath>
          <clipPath id="b">
            <path d="M187.5 194.418h66.145v66.144H187.5Zm0 0" />
          </clipPath>
          <clipPath id="c">
            <path d="M220.57 194.418c-18.261 0-33.07 14.809-33.07 33.074 0 18.266 14.809 33.07 33.07 33.07 18.266 0 33.075-14.804 33.075-33.07 0-18.265-14.81-33.074-33.075-33.074Zm0 0" />
          </clipPath>
        </defs>
        <g clipPath="url(#a)">
          <path
            d="M-30-30h360v360H-30z"
            className="fill-[#381e1e] dark:fill-white"
          />
        </g>
        <g clipPath="url(#b)">
          <g clipPath="url(#c)">
            <path
              d="M187.5 194.418h66.145v66.144H187.5Zm0 0"
              className="fill-[#fff] dark:fill-[#381e1e]"
            />
          </g>
        </g>
      </svg>
      {extanded && (
        <div className="font-josefin group-data-collapsed/sidebar:opacity-0 mt-1.5 text-base font-bold leading-normal tracking-tighter transition-colors">
          {siteConfig.global.name}
        </div>
      )}
    </Link>
  );
};
