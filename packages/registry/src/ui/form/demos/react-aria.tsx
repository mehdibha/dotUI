"use client";

import { Form } from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import { Checkbox, CheckboxIndicator } from "@dotui/registry/ui/checkbox";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem } from "@dotui/registry/ui/combobox";
import { DatePicker } from "@dotui/registry/ui/date-picker";
import { FieldGroup, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { Radio, RadioGroup, RadioIndicator } from "@dotui/registry/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
	return (
		<div className="w-sm space-y-4 rounded-lg border bg-muted p-8">
			<h1 className="font-bold text-xl">Register</h1>
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					const data = Object.fromEntries(new FormData(e.currentTarget));
					alert(JSON.stringify(data, null, 2));
				}}
				className="space-y-4"
			>
				<TextField name="name" minLength={2} isRequired>
					<Label>Name</Label>
					<Input placeholder="Name" />
				</TextField>
				<TextField name="email" type="email" isRequired>
					<Label>Email</Label>
					<Input placeholder="Email" />
				</TextField>
				<RadioGroup name="gender" isRequired orientation="horizontal">
					<Label>Gender</Label>
					<FieldGroup>
						<Radio value="male">
							<RadioIndicator />
							<Label>Male</Label>
						</Radio>
						<Radio value="female">
							<RadioIndicator />
							<Label>Female</Label>
						</Radio>
						<Radio value="other">
							<RadioIndicator />
							<Label>Other</Label>
						</Radio>
					</FieldGroup>
				</RadioGroup>
				<DatePicker name="birth-date" isRequired className="w-full">
					<Label>Birth Date</Label>
					<Input placeholder="Birth Date" />
				</DatePicker>
				<Combobox name="language" isRequired>
					<Label>Preferred language</Label>
					<ComboboxInput />
					<ComboboxContent items={languages}>
						{(item) => (
							<ComboboxItem key={item.value} id={item.value}>
								{item.label}
							</ComboboxItem>
						)}
					</ComboboxContent>
				</Combobox>
				<Select name="referral" isRequired>
					<Label>How did you hear about us?</Label>
					<SelectTrigger variant="default" className="w-full" />
					<SelectContent>
						<SelectItem id="linkedin">LinkedIn</SelectItem>
						<SelectItem id="x">X</SelectItem>
					</SelectContent>
				</Select>
				<Checkbox isRequired>
					<CheckboxIndicator />
					<Label>I agree to the terms and conditions</Label>
				</Checkbox>
				<div className="flex justify-end">
					<Button type="submit">Register</Button>
				</div>
			</Form>
		</div>
	);
}

const languages = [
	{ label: "English", value: "en" },
	{ label: "French", value: "fr" },
	{ label: "German", value: "de" },
	{ label: "Spanish", value: "es" },
	{ label: "Portuguese", value: "pt" },
	{ label: "Russian", value: "ru" },
	{ label: "Japanese", value: "ja" },
	{ label: "Korean", value: "ko" },
	{ label: "Chinese", value: "zh" },
] as const;
