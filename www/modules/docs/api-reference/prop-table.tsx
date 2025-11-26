"use client";

import React from "react";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";

import type { PropDisplayDoc } from "./types";

interface PropTableProps {
  props: PropDisplayDoc[];
  variant?: "card" | "plain";
}

export function PropTable({ props, variant = "card" }: PropTableProps) {
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  const wrapperClass =
    variant === "card"
      ? "overflow-hidden rounded-lg border border-border"
      : "overflow-hidden";

  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className={wrapperClass}>
      <table className="w-full table-fixed border-collapse border-spacing-y-2 text-sm">
        <thead className="bg-card text-left text-fg-muted text-xs uppercase">
          <tr>
            <th className="w-1/3 px-4 py-2 font-medium">Name</th>
            <th className="w-1/3 px-4 py-2 font-medium">Type</th>
            <th className="w-1/3 px-4 py-2 font-medium">Default</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => {
            const key = `${prop.name}-${index}`;
            const isOpen = openKey === key;
            const hasDefault = Boolean(prop.defaultValue?.trim());

            return (
              <React.Fragment key={key}>
                <PropRow
                  prop={prop}
                  isOpen={isOpen}
                  hasDefault={hasDefault}
                  onToggle={() => toggle(key)}
                />
                {isOpen && <PropDetailsRow prop={prop} />}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PropRow({
  prop,
  isOpen,
  hasDefault,
  onToggle,
}: {
  prop: PropDisplayDoc;
  isOpen: boolean;
  hasDefault: boolean;
  onToggle: () => void;
}) {
  return (
    <tr
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      className="cursor-default border-border/60 border-t align-top transition-colors hover:bg-inverse/10 focus-visible:bg-inverse/20 focus-visible:outline-none active:bg-inverse/15"
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <td className="w-1/3 px-3 py-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <InlineCode html={prop.highlightedName} text={prop.name} />
          {prop.deprecated && <Badge variant="danger" label="Deprecated" />}
        </div>
      </td>
      <td className="w-1/3 px-3 py-2 font-mono text-[13px]">
        <InlineCode
          html={prop.highlightedTypeSummary}
          text={prop.typeSummary}
        />
      </td>
      <td className="w-1/3 px-3 py-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          {hasDefault ? (
            <InlineCode
              html={prop.highlightedDefault}
              text={prop.defaultValue ?? ""}
              className="text-fg-muted"
            />
          ) : (
            <span className="text-fg-muted">-</span>
          )}
          <ChevronRightIcon
            className={cn(
              "size-4 shrink-0 text-fg-muted transition-transform",
              isOpen ? "rotate-90" : "rotate-0",
            )}
            aria-hidden="true"
          />
        </div>
      </td>
    </tr>
  );
}

function PropDetailsRow({ prop }: { prop: PropDisplayDoc }) {
  return (
    <tr className="border-border/60 border-t bg-muted/10">
      <td colSpan={3} className="px-4 py-4">
        <PropDetails prop={prop} />
      </td>
    </tr>
  );
}

function PropDetails({ prop }: { prop: PropDisplayDoc }) {
  return (
    <div className="space-y-4 text-sm">
      <Detail label="Name">
        <InlineCode html={prop.highlightedName} text={prop.name} />
      </Detail>
      <Detail label="Type">
        <InlineCode html={prop.highlightedType} text={prop.type} />
      </Detail>
      <Detail label="Default">
        {prop.defaultValue ? (
          <InlineCode
            html={prop.highlightedDefault}
            text={prop.defaultValue}
            className="text-fg-muted"
          />
        ) : (
          <span className="text-fg-muted">-</span>
        )}
      </Detail>
      <Detail label="Description">
        {prop.description ? (
          <p className="text-fg leading-relaxed">
            {prop.description.split("\n").map((paragraph, index) => (
              <React.Fragment key={index}>
                {index > 0 && <br />}
                {paragraph}
              </React.Fragment>
            ))}
          </p>
        ) : (
          <span aria-hidden="true">—</span>
        )}
      </Detail>
    </div>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="font-semibold text-fg-muted text-xs uppercase tracking-wide">
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}

function Badge({
  label,
  variant,
}: {
  label: string;
  variant: "muted" | "danger";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 font-semibold text-[10px] uppercase tracking-wide",
        variant === "muted"
          ? "bg-muted text-fg-muted"
          : "bg-danger-muted text-fg-danger",
      )}
    >
      {label}
    </span>
  );
}

function InlineCode({
  html,
  text,
  className,
}: {
  html?: string;
  text?: string;
  className?: string;
}) {
  if (html) {
    return (
      <code
        className={cn(
          "inline-flex rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-fg leading-relaxed",
          className,
        )}
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: Highlighted markup generated on the server */
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (text) {
    return (
      <code
        className={cn(
          "inline-flex rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-fg leading-relaxed",
          className,
        )}
      >
        {text}
      </code>
    );
  }

  return null;
}
