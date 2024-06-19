"use client";

import {
  Section as AriaSection,
  Header as AriaHeader,
  SectionProps as AriaSectionProps,
  Collection as AriaCollection,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const SectionStyles = tv({
  slots: {
    root: "first:mt-1 mt-2 space-y-px",
    title: "text-sm font-bold pl-3 mb-1",
  },
});

interface SectionProps<T> extends AriaSectionProps<T> {
  title?: string;
}
const Section = <T extends object>({ className, title, ...props }: SectionProps<T>) => {
  return (
    <SectionRoot {...props}>
      <SectionTitle>{title}</SectionTitle>
      <AriaCollection items={props.items}>{props.children}</AriaCollection>
    </SectionRoot>
  );
};

interface SectionRootProps<T> extends AriaSectionProps<T> {}
const SectionRoot = <T extends object>({ className, ...props }: SectionRootProps<T>) => {
  const { root } = SectionStyles();
  return <AriaSection className={root({ className })} {...props} />;
};

interface SectionTitleProps extends React.HTMLAttributes<HTMLElement> {}
const SectionTitle = ({ className, ...props }: SectionTitleProps) => {
  const { title } = SectionStyles();
  return <AriaHeader className={title({ className })} {...props} />;
};

export { Section, SectionTitle };
