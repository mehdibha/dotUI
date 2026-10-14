"use client";

import * as React from "react";
import * as AutocompletePrimitive from "react-aria-components/Autocomplete";
import { MenuContext } from "react-aria-components/Menu";
import type { Key } from "react-aria-components/Menu";
import { PopoverContext } from "react-aria-components/Popover";
import { Provider } from "react-aria-components/slots";
import {
  tokenFieldPositionToDOMRange,
  TokenFieldValue,
} from "react-aria-components/TokenField";
import { useControlledState } from "react-stately/useControlledState";

import type { PopoverProps } from "@/components/ui/popover";
import { TokenField } from "@/components/ui/token-field";
import type { TokenFieldProps } from "@/components/ui/token-field";
import { tv } from "tailwind-variants";

const mentionVariants = tv({
  slots: {
    root: "group/mention",
  },
});

const { root } = mentionVariants();

/* -------------------------------------------------------------------------- */

interface MentionState {
  /** The trigger text that opened the suggestions (e.g. `"@"` or `"/"`), or null while closed. */
  trigger: string | null;
  /** The text typed after the trigger. */
  query: string;
}

interface MentionProps extends Omit<
  TokenFieldProps,
  "children" | "role" | "slot"
> {
  /** Opens the suggestions: a string, or a RegExp matching several triggers (e.g. `/[@/]/`). @default "@" */
  trigger?: string | RegExp;
  /** Maps a selected item's key to the text inserted after the trigger. @default String(key) */
  getItemText?: (key: Key) => string;
  /** Where the suggestions popover is placed relative to the caret. @default "bottom start" */
  placement?: PopoverProps["placement"];
  /** The input and suggestions; a function receives the active trigger and query. */
  children?: React.ReactNode | ((state: MentionState) => React.ReactNode);
}

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Typing a trigger opens a caret-anchored `Menu` of suggestions; selecting one inserts it as an inline token. */
function Mention({
  trigger = "@",
  getItemText = (key) => String(key),
  placement = "bottom start",
  className,
  children,
  value: valueProp,
  defaultValue,
  onChange,
  ...props
}: MentionProps) {
  const { startsWith } = AutocompletePrimitive.useFilter({
    sensitivity: "base",
  });
  const [value, setValue] = useControlledState(
    valueProp,
    defaultValue ?? emptyValue,
    onChange,
  );
  const rootRef = React.useRef<HTMLDivElement>(null);

  // The `g` flag is dropped so `exec` stays stateless.
  const triggerPattern = React.useMemo(
    () =>
      typeof trigger === "string"
        ? new RegExp(`(?<=^|\\s)${escapeRegExp(trigger)}`)
        : new RegExp(trigger.source, trigger.flags.replace("g", "")),
    [trigger],
  );

  const active = React.useMemo(() => {
    const anchor = value.findText(
      value.caretPosition,
      TokenFieldValue.Direction.Backward,
      triggerPattern,
    );
    if (!anchor) return null;
    const slice = value.slice(anchor, value.caretPosition);
    if (slice.segments.some((segment) => segment.type === "token")) return null;
    const raw = slice.toString();
    const match = triggerPattern.exec(raw);
    if (match?.index !== 0) return null;
    const query = raw.slice(match[0].length);
    if (/\s/.test(query)) return null;
    return {
      anchor,
      trigger: match[0],
      query,
      key: `${anchor.index}:${anchor.offset}:${raw}`,
    };
  }, [value, triggerPattern]);

  const [dismissedKey, setDismissedKey] = React.useState<string | null>(null);
  const isOpen = active != null && dismissedKey !== active.key;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) setDismissedKey(active?.key ?? null);
    },
    [active],
  );

  const getInput = React.useCallback(
    () =>
      rootRef.current?.querySelector<HTMLDivElement>("[data-token-input]") ??
      null,
    [],
  );

  const insert = React.useCallback(
    (key: Key) => {
      if (!active) return;
      // TokenField only applies the stored caret position while focused, so refocus first.
      const input = getInput();
      if (input && document.activeElement !== input) input.focus();
      setValue((value) =>
        value.replaceRangeWithSegments(
          active.anchor,
          value.caretPosition,
          [
            {
              type: "token",
              text: `${active.trigger}${getItemText(key)}`,
              value: key,
            },
            { type: "text", text: " " },
          ],
          false,
        ),
      );
    },
    [active, getItemText, setValue, getInput],
  );

  const getTargetRect = React.useCallback(
    (target: Element) => {
      const input = getInput();
      if (!input || !active) return target.getBoundingClientRect();
      return tokenFieldPositionToDOMRange(
        input,
        active.anchor,
      ).getBoundingClientRect();
    },
    [active, getInput],
  );

  return (
    <AutocompletePrimitive.Autocomplete
      inputValue={active?.query ?? ""}
      filter={startsWith}
    >
      <Provider
        values={[
          [
            PopoverContext,
            {
              triggerRef: rootRef,
              isOpen,
              onOpenChange,
              isNonModal: true,
              placement,
              trigger: "MenuTrigger",
              getTargetRect,
              // Anchored to the caret, so drop the field's width as the popover's minimum.
              style: { "--trigger-width": "0px" } as React.CSSProperties,
            },
          ],
          [MenuContext, { onAction: insert }],
        ]}
      >
        <TokenField
          {...props}
          ref={rootRef}
          value={value}
          onChange={setValue}
          className={root({ className })}
        >
          {typeof children === "function"
            ? children({
                trigger: active?.trigger ?? null,
                query: active?.query ?? "",
              })
            : children}
        </TokenField>
      </Provider>
    </AutocompletePrimitive.Autocomplete>
  );
}

const emptyValue = new TokenFieldValue([]);

/* -------------------------------------------------------------------------- */

export type { MentionProps, MentionState };
export { Mention };
