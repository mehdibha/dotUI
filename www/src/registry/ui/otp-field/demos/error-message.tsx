import { FieldError, Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { OTPField } from "@/registry/ui/otp-field";

export default function ErrorMessage() {
	return (
		<OTPField length={6} isInvalid>
			<Label>Verification code</Label>
			<Group>
				<Input />
				<Input aria-label="Digit 2" />
				<Input aria-label="Digit 3" />
				<Input aria-label="Digit 4" />
				<Input aria-label="Digit 5" />
				<Input aria-label="Digit 6" />
			</Group>
			<FieldError>Enter the code from your message.</FieldError>
		</OTPField>
	);
}
