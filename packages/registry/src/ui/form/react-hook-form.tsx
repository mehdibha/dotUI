"use client";

import { Controller } from "react-hook-form";
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<UseControllerProps<TFieldValues, TName>, "render"> & {
  render: (
    props: Omit<ControllerRenderProps<TFieldValues, TName>, "disabled"> &
      Omit<ControllerFieldState, "invalid" | "error"> & {
        isInvalid: boolean;
        isDisabled?: boolean;
        errorMessage?: string;
      },
  ) => React.ReactElement;
};

function FormControl<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ render, ...rest }: FormControlProps<TFieldValues, TName>) {
  return (
    <Controller
      {...rest}
      render={({
        field: { disabled, ...field },
        fieldState: { invalid, error, ...fieldState },
      }) =>
        render({
          ...field,
          ...fieldState,
          isDisabled: disabled,
          isInvalid: invalid,
          errorMessage: error?.message,
        })
      }
    />
  );
}

export { FormControl };
