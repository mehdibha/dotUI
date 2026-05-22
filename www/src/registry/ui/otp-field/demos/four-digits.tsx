import { Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { OTPField } from "@/registry/ui/otp-field";

export default function FourDigits() {
	return (
		<OTPField length={4}>
			<Label>PIN</Label>
			<Group>
				<Input />
				<Input aria-label="Digit 2" />
				<Input aria-label="Digit 3" />
				<Input aria-label="Digit 4" />
			</Group>
		</OTPField>
	);
}
