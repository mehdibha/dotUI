import { type SVGProps } from "react";

interface IconProps extends Partial<SVGProps<SVGSVGElement>> {
  size?: string | number;
}

export const ActivitySquareIcon = ({
  color = "currentColor",
  size = 24,
  ...rest
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      {...rest}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M17 12h-2l-2 5-2-10-2 5H7" />
    </svg>
  );
};
