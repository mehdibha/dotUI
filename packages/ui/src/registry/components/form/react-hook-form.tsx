"use client";

import React from "react";
import { Controller } from "react-hook-form";
import type { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { Field as TanStackField } from "@tanstack/react-form";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

type CommonRenderProps = {
  name: string;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  ref?: any;
  isInvalid: boolean;
  isDisabled?: boolean;
  errorMessage?: string;
};

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "render"> & {
  render: (props: CommonRenderProps) => React.ReactElement;
};

type TanStackFormControlProps<TFormData, TName extends string> = {
  form: ReactFormExtendedApi<TFormData, any, any, any, any, any, any, any, any, any, any, any>;
  name: TName;
  mode?: "value" | "array";
  render: (props: CommonRenderProps) => React.ReactElement;
};

function getFirstErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  // Standard Schema Issue shape
  // @ts-expect-error: best-effort extraction
  if (typeof error === "object" && error?.message) return String(error.message);
  try {
    return JSON.stringify(error);
  } catch {
    return undefined;
  }
}

function FormControl<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: FormControlProps<TFieldValues, TName>): React.ReactElement;
function FormControl<TFormData, TName extends string>(
  props: TanStackFormControlProps<TFormData, TName>,
): React.ReactElement;
function FormControl(...allProps: any[]): React.ReactElement {
  const props = allProps[0] as any;
  if ("control" in props) {
    const { render, ...rest } = props as FormControlProps<any, any>;
    return (
      <Controller
        {...rest}
        render={({
          field: { disabled, ...field },
          fieldState: { invalid, error },
        }) =>
          render({
            name: field.name,
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
            ref: (field as any).ref,
            isDisabled: disabled,
            isInvalid: invalid,
            errorMessage: (error as any)?.message,
          })
        }
      />
    );
  }

  const { form, name, mode, render } = props as TanStackFormControlProps<any, any>;
  return (
    <TanStackField form={form} name={name} mode={mode}>
      {(field) =>
        render({
          name: field.name as any,
          value: field.state.value,
          onChange: field.handleChange,
          onBlur: field.handleBlur,
          isInvalid: !field.state.meta.isValid,
          isDisabled: undefined,
          errorMessage: getFirstErrorMessage(field.state.meta.errors[0]),
        })
      }
    </TanStackField>
  );
}

export { FormControl };
