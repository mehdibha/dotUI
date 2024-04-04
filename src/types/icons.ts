import type { ReactSVG, ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export type IconNode = [elementName: keyof ReactSVG, attrs: Record<string, string>][];
export type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
export type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;

export interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type Icon = ForwardRefExoticComponent<IconProps>;

export type Library = "lucide-icons" | "simple-icons";
