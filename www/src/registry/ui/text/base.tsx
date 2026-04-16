"use client";

import * as TextPrimitives from "react-aria-components/Text";


import { useSkeletonText } from "@/registry/ui/skeleton";

interface TextProps extends TextPrimitives.TextProps {}

const Text = ({ children, ...props }: TextProps) => {
	children = useSkeletonText(children);

	return <TextPrimitives.Text {...props}>{children}</TextPrimitives.Text>;
};

export type { TextProps };
export { Text };
