"use client";

import {
  Section as AriaSection,
  ListBoxSection as AriaListBoxSection,
  Header as AriaHeader,
  type SectionProps as AriaSectionProps,
  Collection as AriaCollection,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const SectionStyles = tv({
  slots: {
    root: "space-y-px pt-2",
    title: "text-fg-muted mb-1 pl-3 text-xs",
  },
});

interface SectionProps<T> extends AriaSectionProps<T> {
  title?: string;
}
const Section = <T extends object>({ title, ...props }: SectionProps<T>) => {
  return (
    <SectionRoot {...props}>
      {title && <SectionTitle>{title}</SectionTitle>}
      <AriaCollection items={props.items}>{props.children}</AriaCollection>
    </SectionRoot>
  );
};

type SectionRootProps<T> = AriaSectionProps<T>;
const SectionRoot = <T extends object>({
  className,
  ...props
}: SectionRootProps<T>) => {
  const { root } = SectionStyles();
  return <AriaSection className={root({ className })} {...props} />;
};

type SectionTitleProps = React.HTMLAttributes<HTMLElement>;
const SectionTitle = ({ className, ...props }: SectionTitleProps) => {
  const { title } = SectionStyles();
  return <AriaHeader className={title({ className })} {...props} />;
};

export { Section, SectionTitle };
