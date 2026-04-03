"use client";

import { Header as AriaHeader } from "react-aria-components";

export function Header(props: React.ComponentProps<typeof AriaHeader>) {
	return <AriaHeader {...props} />;
}
