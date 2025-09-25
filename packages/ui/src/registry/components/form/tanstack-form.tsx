"use client";

import React from "react";
import { useField } from "@tanstack/react-form";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

type FormControlProps<TFormData = any, TName extends keyof TFormData = keyof TFormData> = {
  form: ReactFormExtendedApi<TFormData, any, any, any, any, any, any, any, any, any, any, any>;
  name: TName;
  validators?: {
    onChange?: (props: { value: any; fieldApi: any }) => string | undefined;
    onChangeAsync?: (props: { value: any; fieldApi: any }) => Promise<string | undefined>;
    onBlur?: (props: { value: any; fieldApi: any }) => string | undefined;
    onBlurAsync?: (props: { value: any; fieldApi: any }) => Promise<string | undefined>;
    onSubmit?: (props: { value: any; fieldApi: any }) => string | undefined;
    onSubmitAsync?: (props: { value: any; fieldApi: any }) => Promise<string | undefined>;
  };
  render: (props: {
    value: TFormData[TName];
    onChange: (value: TFormData[TName]) => void;
    onBlur: () => void;
    name: string;
    isInvalid: boolean;
    isDisabled?: boolean;
    errorMessage?: string;
    isTouched: boolean;
    isDirty: boolean;
    isValidating: boolean;
  }) => React.ReactElement;
  defaultValue?: TFormData[TName];
};

function FormControl<TFormData = any, TName extends keyof TFormData = keyof TFormData>({
  form,
  name,
  validators,
  render,
  defaultValue,
}: FormControlProps<TFormData, TName>) {
  const field = useField({
    form,
    name: name as string,
    validators,
    defaultValue: defaultValue as any,
  });

  return render({
    value: field.state.value as TFormData[TName],
    onChange: (value: TFormData[TName]) => field.handleChange(value as any),
    onBlur: field.handleBlur,
    name: String(name),
    isInvalid: field.state.meta.errors.length > 0,
    errorMessage: field.state.meta.errors[0],
    isTouched: field.state.meta.isTouched,
    isDirty: field.state.meta.isDirty,
    isValidating: field.state.meta.isValidating,
  });
}

export { FormControl };
export type { FormControlProps };