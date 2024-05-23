import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { composeRenderProps } from 'react-aria-components';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function composeTailwindRenderProps<T>(className: string | ((v: T) => string) | undefined, tw: string): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => cn(tw, className));
}


