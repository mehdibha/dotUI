import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField } from "@/registry/ui/number-field";

export default function Demo() {
	return (
		<div className="grid grid-cols-2 gap-4">
			<NumberField
				defaultValue={0}
				formatOptions={{
					signDisplay: "exceptZero",
					minimumFractionDigits: 1,
					maximumFractionDigits: 2,
				}}
			>
				<Label>Decimal</Label>
				<Group>
					<Button slot="decrement" />
					<Input />
					<Button slot="increment" />
				</Group>
			</NumberField>

			<NumberField
				defaultValue={0.05}
				formatOptions={{
					style: "percent",
				}}
			>
				<Label>Percentage</Label>
				<Group>
					<Button slot="decrement" />
					<Input />
					<Button slot="increment" />
				</Group>
			</NumberField>

			<NumberField
				defaultValue={45}
				formatOptions={{
					style: "currency",
					currency: "EUR",
					currencyDisplay: "code",
					currencySign: "accounting",
				}}
			>
				<Label>Currency</Label>
				<Group>
					<Button slot="decrement" />
					<Input />
					<Button slot="increment" />
				</Group>
			</NumberField>

			<NumberField
				defaultValue={4}
				formatOptions={{
					style: "unit",
					unit: "inch",
					unitDisplay: "long",
				}}
			>
				<Label>Unit</Label>
				<Group>
					<Button slot="decrement" />
					<Input />
					<Button slot="increment" />
				</Group>
			</NumberField>
		</div>
	);
}
