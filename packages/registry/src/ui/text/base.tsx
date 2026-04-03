"use client";

import { Text as AriaText } from "react-aria-components";
import type { TextProps as AriaTextProps } from "react-aria-components";

import { useSkeletonText } from "@dotui/registry/ui/skeleton";

interface TextProps extends AriaTextProps {}

const Text = ({ children, ...props }: TextProps) => {
	children = useSkeletonText(children);

	return <AriaText {...props}>{children}</AriaText>;
};

export type { TextProps };
export { Text };
