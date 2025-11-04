"use client";
import { Heading as AriaHeading } from "react-aria-components";

export function Heading(props: React.ComponentProps<typeof AriaHeading>) {
  return <AriaHeading {...props} />;
}
