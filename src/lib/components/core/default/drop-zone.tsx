"use client";

import * as React from "react";
import { useSlotId } from "@react-aria/utils";
import {
  DropZone as AriaDropZone,
  Text as AriaText,
  Provider,
  composeRenderProps,
  type DropZoneProps as AriaDropZoneProps,
  type TextProps as AriaTextProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const dropZoneStyles = tv({
  slots: {
    root: "flex flex-col p-6 items-center justify-center gap-2 rounded-md border border-dashed text-sm data-[drop-target]:border-solid data-[drop-target]:border-primary data-[drop-target]:bg-accent",
    label: "font-semibold text-lg",
    description: "text-fg-muted text-sm",
  },
});

interface DropZoneProps extends DropZoneRootProps {
  label?: string;
  labelProps?: DropZoneLabelProps;
  description?: string;
  descriptionProps?: DropZoneDescriptionProps;
}
const DropZone = ({
  label,
  labelProps,
  description,
  descriptionProps,
  ...props
}: DropZoneProps) => {
  return (
    <DropZoneRoot {...props}>
      {composeRenderProps(props.children, (children) => (
        <>
          {label && <DropZoneLabel {...labelProps}>{label}</DropZoneLabel>}
          {description && (
            <DropZoneDescription {...descriptionProps}>{description}</DropZoneDescription>
          )}
          {children}
        </>
      ))}
    </DropZoneRoot>
  );
};

interface DropZoneRootProps extends Omit<AriaDropZoneProps, "className"> {
  className?: string;
}
const DropZoneRoot = ({ className, ...props }: DropZoneRootProps) => {
  const { root } = dropZoneStyles();
  const descriptionId = useSlotId();
  return (
    <Provider values={[[DescriptionContext, { id: descriptionId }]]}>
      <AriaDropZone
        className={root({ className })}
        aria-describedby={descriptionId}
        {...props}
      />
    </Provider>
  );
};

type DropZoneLabelProps = Omit<AriaTextProps, "slot">;
const DropZoneLabel = ({ className, ...props }: DropZoneLabelProps) => {
  const { label } = dropZoneStyles();
  return <AriaText className={label({ className })} {...props} slot="label" />;
};

type DropZoneDescriptionProps = Omit<AriaTextProps, "slot">;
const DropZoneDescription = ({ className, ...props }: DropZoneDescriptionProps) => {
  const { description } = dropZoneStyles();
  const additionalProps = useDescriptionContext();
  return <p className={description({ className })} {...props} {...additionalProps} />;
};

const DescriptionContext = React.createContext<{ id: string } | null>(null);
const useDescriptionContext = () => React.useContext(DescriptionContext);

export { DropZone };
