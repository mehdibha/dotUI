"use client";

import { Heading as AriaHeading } from "react-aria-components";

interface HeadingProps extends React.ComponentProps<typeof AriaHeading> {}

function Heading(props: React.ComponentProps<typeof AriaHeading>) {
  return <AriaHeading {...props} />;
}

export { Heading };
export type { HeadingProps };
