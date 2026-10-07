"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TagGroupPrimitives from "react-aria-components/TagGroup";
import { type VariantProps, tv } from "tailwind-variants";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const tagGroupVariants = tv({
  slots: {
    tagGroup: "group/tag-group flex flex-col gap-2",
    tagList:
      "flex flex-wrap items-center outline-hidden empty:text-fg-muted gap-1",
    tag: "group/tag relative inline-flex w-fit shrink-0 cursor-default items-center justify-center gap-1 rounded-sm font-medium whitespace-nowrap outline-hidden transition-colors select-ui data-react-aria-pressable:cursor-interactive **:[svg]:pointer-events-none **:[svg]:shrink-0 focus-visible:focus-ring data-href:cursor-interactive data-selection-mode:disabled:cursor-disabled [--chip-border:var(--color-border)] [--chip-dot:var(--color-fg-muted)] [--chip-fg-tint:var(--color-fg)] [--chip-fg:var(--color-fg-on-neutral)] [--chip-fill:var(--color-neutral)] [--chip-tint:color-mix(in_oklab,var(--color-muted)_50%,transparent)] selected:bg-selected selected:text-fg-on-selected disabled:[--chip-border:var(--disabled-border,var(--color-border))] disabled:[--chip-fg-tint:var(--disabled-fg,var(--color-fg))] disabled:[--chip-fg:var(--disabled-fg,var(--color-fg-on-neutral))] disabled:[--chip-fill:var(--disabled-bg,var(--color-neutral))] disabled:[--chip-tint:var(--disabled-bg,var(--color-muted))] text-xs/relaxed **:[svg]:not-with-[size]:size-3 has-[button[slot=remove]]:pr-0 **:[button[slot=remove]]:-ml-1 **:[button[slot=remove]]:size-5 **:[button[slot=remove]]:rounded-none **:[button[slot=remove]]:bg-transparent **:[button[slot=remove]]:text-fg-muted **:[button[slot=remove]]:hover:text-fg group-data-[size=sm]/tag-group:h-4.25 h-5.25 px-1.5 group-data-[size=lg]/tag-group:h-6.25 group-data-[size=lg]/tag-group:text-sm",
  },
  variants: {
    appearance: {
      solid: {
        tag: "bg-(--chip-fill) text-(--chip-fg)",
      },
      soft: {
        tag: "bg-(--chip-tint) text-(--chip-fg-tint)",
      },
      outline: {
        tag: "border border-(--chip-border) text-(--chip-fg-tint)",
      },
      "soft-outline": {
        tag: "border border-(--chip-border) bg-(--chip-tint) text-(--chip-fg-tint)",
      },
      dot: {
        tag: "border border-border text-fg before:size-2 before:shrink-0 before:rounded-full before:bg-(--chip-dot,var(--chip-fill)) before:content-['']",
      },
    },
  },
  defaultVariants: {
    appearance: "solid",
  },
});

const { tagGroup, tagList, tag } = tagGroupVariants();

/* -------------------------------------------------------------------------- */

interface TagGroupProps extends TagGroupPrimitives.TagGroupProps {
  size?: "sm" | "md" | "lg";
}

function TagGroup({ className, size = "md", ...props }: TagGroupProps) {
  return (
    <TagGroupPrimitives.TagGroup
      data-tag-group=""
      data-size={size}
      className={tagGroup({ className })}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface TagListProps<T> extends TagGroupPrimitives.TagListProps<T> {}

function TagList<T extends object>({ className, ...props }: TagListProps<T>) {
  return (
    <TagGroupPrimitives.TagList
      data-tag-list=""
      className={composeRenderProps(className, (cn) =>
        tagList({ className: cn }),
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface TagProps
  extends TagGroupPrimitives.TagProps, VariantProps<typeof tagGroupVariants> {}

function Tag({ className, appearance, ...props }: TagProps) {
  const textValue =
    typeof props.children === "string" ? props.children : undefined;

  return (
    <TagGroupPrimitives.Tag
      data-tag=""
      textValue={textValue}
      className={composeRenderProps(className, (className) =>
        tag({ appearance, className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <Button slot="remove" variant="quiet" isIconOnly size="xs">
              <XIcon />
            </Button>
          )}
        </>
      ))}
    </TagGroupPrimitives.Tag>
  );
}

/* -------------------------------------------------------------------------- */

export type { TagGroupProps, TagListProps, TagProps };
export { Tag, TagGroup, TagList };
