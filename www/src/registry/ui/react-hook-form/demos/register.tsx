"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { Checkbox, CheckboxIndicator } from "@/registry/ui/checkbox";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem } from "@/registry/ui/combobox";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { FieldGroup, Label } from "@/registry/ui/field";
import { DateInput, Input, InputAddon, InputGroup } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";
import { Radio, RadioGroup, RadioIndicator } from "@/registry/ui/radio-group";
import { FormControl } from "@/registry/ui/react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";
import { TextField } from "@/registry/ui/text-field";

const FormSchema = z.object({
	name: z.string().min(2),
	email: z.email(),
	gender: z.enum(["male", "female", "other"]),
	"birth-date": z.string(),
	referral: z.string({
		error: "Please select a method.",
	}),
	language: z.string({
		error: "Please select a language.",
	}),
	terms: z.boolean().refine((val) => val === true, {
		message: "You must accept the terms and conditions",
	}),
});

export default function Demo() {
	const { handleSubmit, control } = useForm<z.infer<typeof FormSchema>>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(FormSchema as any),
	});

	return (
		<div className="w-sm space-y-4 rounded-lg border bg-muted p-8">
			<h1 className="font-bold text-xl">Register</h1>
			<form
				onSubmit={handleSubmit((data) => {
					alert(JSON.stringify(data, null, 2));
				})}
				className="space-y-4"
			>
				<FormControl
					name="name"
					control={control}
					render={(props) => (
						<TextField {...props}>
							<Label>Name</Label>
							<Input placeholder="Name" />
						</TextField>
					)}
				/>
				<FormControl
					name="email"
					control={control}
					render={(props) => (
						<TextField {...props}>
							<Label>Email</Label>
							<Input placeholder="Email" />
						</TextField>
					)}
				/>
				<FormControl
					name="gender"
					control={control}
					render={(props) => (
						<RadioGroup orientation="horizontal" {...props}>
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
					)}
				/>
				<FormControl
					name="birth-date"
					control={control}
					render={({ value, onChange, ...props }) => (
						<DatePicker
							value={value ? parseDate(value) : undefined}
							onChange={(val) => onChange(val?.toString())}
							className="w-full"
							{...props}
						>
							<Label>Birth Date</Label>
							<InputGroup>
								<DateInput />
								<InputAddon>
									<Button variant="default" size="icon-sm">
										<CalendarIcon />
									</Button>
								</InputAddon>
							</InputGroup>
							<Overlay type="popover" mobileType="drawer">
								<DialogContent>
									<Calendar aria-label="Pick a date" />
								</DialogContent>
							</Overlay>
						</DatePicker>
					)}
				/>
				<FormControl
					name="language"
					control={control}
					render={({ value, onChange, ...props }) => (
						<Combobox inputValue={value} onSelectionChange={onChange} className="w-full" {...props}>
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
					)}
				/>
				<FormControl
					name="referral"
					control={control}
					render={(props) => (
						<Select className="w-full" {...props}>
							<Label>How did you hear about us?</Label>
							<SelectTrigger variant="default" className="w-full" />
							<SelectContent>
								<SelectItem id="linkedin">LinkedIn</SelectItem>
								<SelectItem id="x">X</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
				<FormControl
					name="terms"
					control={control}
					render={({ value, ...props }) => (
						<Checkbox isSelected={value} {...props}>
							<CheckboxIndicator />
							<Label>I agree to the terms and conditions</Label>
						</Checkbox>
					)}
				/>
				<div className="flex justify-end">
					<Button type="submit">Register</Button>
				</div>
			</form>
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
