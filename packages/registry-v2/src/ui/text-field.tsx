"use client";

import * as React from "react";
import {
  TextField as AriaTextField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Description, FieldError, Label } from "./field";
import { Input, InputAddon, InputGroup, TextArea } from "./input";

const textFieldStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

/* -----------------------------------------------------------------------------------------------*/

interface TextFieldProps extends React.ComponentProps<typeof AriaTextField> {}

const TextField = ({ className, ...props }: TextFieldProps) => {
  return (
    <AriaTextField
      data-slot="text-field"
      className={composeRenderProps(className, (className) =>
        textFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundTextField = Object.assign(TextField, {
  Input,
  TextArea,
  InputGroup,
  InputAddon,
  Label,
  Description,
  FieldError,
});

export { CompoundTextField as TextField };

export type { TextFieldProps };
