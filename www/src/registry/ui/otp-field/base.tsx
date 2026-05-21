"use client";

import * as React from "react";

import { OTPFieldPreview as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as FieldErrorPrimitive from "react-aria-components/FieldError";
import * as InputPrimitive from "react-aria-components/Input";
import * as LabelPrimitive from "react-aria-components/Label";
import { Provider } from "react-aria-components/slots";
import * as TextPrimitive from "react-aria-components/Text";
import { useSlotId } from "react-aria/private/utils/useId";

import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";

import Disabled from "./demos/disabled";
import { useStyles } from "./styles";

type OTPFieldRootProps = React.ComponentProps<typeof OTPFieldPrimitive.Root>;
type FieldValidationResult = NonNullable<React.ContextType<typeof FieldErrorPrimitive.FieldErrorContext>>;

interface OTPFieldProps extends Omit<OTPFieldRootProps, "disabled" | "readOnly" | "required" | "onValueChange"> {
	isDisabled?: boolean;
	isInvalid?: boolean;
	isReadOnly?: boolean;
	isRequired?: boolean;
	onChange?: (value: string) => void;
}

interface OTPFieldSeparatorProps extends React.ComponentProps<typeof OTPFieldPrimitive.Separator> {}

const VALID_VALIDITY_STATE: ValidityState = {
	badInput: false,
	customError: false,
	patternMismatch: false,
	rangeOverflow: false,
	rangeUnderflow: false,
	stepMismatch: false,
	tooLong: false,
	tooShort: false,
	typeMismatch: false,
	valid: true,
	valueMissing: false,
};

const getAriaIds = (...ids: Array<string | undefined>) => ids.filter(Boolean).join(" ") || undefined;

function OTPField({
	children,
	className,
	id: idProp,
	isDisabled,
	isInvalid,
	isReadOnly,
	isRequired,
	length,
	onChange,
	"aria-describedby": ariaDescribedBy,
	"aria-labelledby": ariaLabelledBy,
	...props
}: OTPFieldProps) {
	const styles = useStyles()();
	const generatedId = React.useId();
	const id = idProp ?? generatedId;
	const labelId = useSlotId();
	const descriptionId = useSlotId();
	const errorMessageId = useSlotId([isInvalid]);
	const validation = React.useMemo<FieldValidationResult>(
		() => ({
			isInvalid: Boolean(isInvalid),
			validationErrors: [],
			validationDetails: { ...VALID_VALIDITY_STATE, valid: !isInvalid },
		}),
		[isInvalid],
	);

	return (
		<Provider
			values={[
				[LabelPrimitive.LabelContext, { id: labelId, htmlFor: id }],
				[
					TextPrimitive.TextContext,
					{
						slots: {
							description: { id: descriptionId },
							errorMessage: { id: errorMessageId },
						},
					},
				],
				[FieldErrorPrimitive.FieldErrorContext, validation],
				[
					InputPrimitive.InputContext,
					{
						"aria-invalid": isInvalid || undefined,
						render: (inputProps) => <OTPFieldPrimitive.Input {...inputProps} data-slot="otp-field-input" />,
						disabled: isDisabled,
						readOnly: isReadOnly,
					},
				],
			]}
		>
			<OTPFieldPrimitive.Root
				{...props}
				data-otp-field=""
				id={id}
				length={length}
				disabled={isDisabled}
				readOnly={isReadOnly}
				required={isRequired}
				aria-describedby={getAriaIds(descriptionId, errorMessageId, ariaDescribedBy)}
				aria-labelledby={getAriaIds(labelId, ariaLabelledBy)}
				aria-invalid={isInvalid || undefined}
				data-field=""
				data-invalid={isInvalid || undefined}
				onValueChange={onChange}
				className={composeRenderProps(className, (className) => styles.root({ className }))}
			>
				{children ?? (
					<Group>
						{Array.from({ length }, (_, index) => (
							<Input key={index} aria-label={index === 0 ? undefined : `Digit ${index + 1}`} />
						))}
					</Group>
				)}
			</OTPFieldPrimitive.Root>
		</Provider>
	);
}

function OTPFieldSeparator(props: OTPFieldSeparatorProps) {
	return <OTPFieldPrimitive.Separator data-slot="otp-field-separator" {...props} />;
}

export type { OTPFieldProps, OTPFieldSeparatorProps };
export { OTPField, OTPFieldSeparator };
