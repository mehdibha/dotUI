"use client";

import { ChevronDownIcon } from "lucide-react";
import * as FormPrimitives from "react-aria-components/Form";

import { Button } from "@/registry/ui/button";
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { Combobox } from "@/registry/ui/combobox";
import { DatePicker } from "@/registry/ui/date-picker";
import { FieldGroup, Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<div className="w-sm space-y-4 rounded-lg border bg-muted p-8">
			<h1 className="font-bold text-xl">Register</h1>
			<FormPrimitives.Form
				onSubmit={(e) => {
					e.preventDefault();
					const data = Object.fromEntries(new FormData(e.currentTarget));
					alert(JSON.stringify(data, null, 2));
				}}
				className="space-y-4"
			>
				<TextField isRequired>
					<Label>Name</Label>
					<Input name="name" minLength={2} placeholder="Name" />
				</TextField>
				<TextField isRequired>
					<Label>Email</Label>
					<Input name="email" type="email" placeholder="Email" />
				</TextField>
				<RadioGroup name="gender" isRequired orientation="horizontal">
					<Label>Gender</Label>
					<FieldGroup>
						<Radio value="male">
							<RadioControl />
							<Label>Male</Label>
						</Radio>
						<Radio value="female">
							<RadioControl />
							<Label>Female</Label>
						</Radio>
						<Radio value="other">
							<RadioControl />
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
					<InputGroup>
						<Input />
						<InputGroupAddon>
							<Button variant="quiet" isIconOnly>
								<ChevronDownIcon />
							</Button>
						</InputGroupAddon>
					</InputGroup>
					<Popover>
						<ListBox items={languages}>
							{(item) => (
								<ListBoxItem key={item.value} id={item.value}>
									{item.label}
								</ListBoxItem>
							)}
						</ListBox>
					</Popover>
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
					<CheckboxControl />
					<Label>I agree to the terms and conditions</Label>
				</Checkbox>
				<div className="flex justify-end">
					<Button type="submit">Register</Button>
				</div>
			</FormPrimitives.Form>
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
