import { type SVGProps } from "react";

interface IconProps extends Partial<SVGProps<SVGSVGElement>> {
  size?: string | number;
}

export const AdobeIcon = ({
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
      fill={color}
      {...rest}
    >
      <path d="m13.966 22.624-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z" />
    </svg>
  );
};
