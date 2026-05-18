"use client";

import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { Badge } from "@/registry/ui/badge";
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { Description, Field, FieldContent, FieldError, FieldGroup, Fieldset, Label, Legend } from "@/registry/ui/field";
import { Input, TextArea } from "@/registry/ui/input";
import { Radio, RadioControl, RadioGroup, RadioIndicator } from "@/registry/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";
import { Slider, SliderControl } from "@/registry/ui/slider";
import { Switch, SwitchControl } from "@/registry/ui/switch";
import { TextField } from "@/registry/ui/text-field";

export default function FieldExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<InputFields />
			<TextareaFields />
			<SelectFields />
			<CheckboxFields />
			<RadioFields />
			<SwitchFields />
			<SliderFields />
			<HorizontalFields />
		</Examples>
	);
}

function InputFields() {
	return (
		<Example title="Input Fields">
			<FieldGroup>
				<TextField>
					<Label>Basic Input</Label>
					<Input placeholder="Enter text" />
				</TextField>
				<TextField>
					<Label>Input with Description</Label>
					<Input placeholder="Enter your username" />
					<Description>Choose a unique username for your account.</Description>
				</TextField>
				<TextField>
					<Label>Email Address</Label>
					<Description>We&apos;ll never share your email with anyone.</Description>
					<Input type="email" placeholder="email@example.com" />
				</TextField>
				<TextField isRequired>
					<Label>Required Field</Label>
					<Input placeholder="This field is required" />
					<Description>This field must be filled out.</Description>
				</TextField>
				<TextField>
					<Label>
						Input with Badge
						<Badge variant="neutral" className="ml-auto">
							Recommended
						</Badge>
					</Label>
					<Input placeholder="Enter value" />
				</TextField>
				<TextField defaultValue="support@copyui.dev" isInvalid>
					<Label>Invalid Input</Label>
					<Input placeholder="This field has an error" />
					<FieldError>This field contains validation errors.</FieldError>
				</TextField>
				<TextField isDisabled>
					<Label>Disabled Field</Label>
					<Input placeholder="Cannot edit" />
					<Description>This field is currently disabled.</Description>
				</TextField>
			</FieldGroup>
		</Example>
	);
}

function TextareaFields() {
	return (
		<Example title="Textarea Fields">
			<FieldGroup>
				<TextField>
					<Label>Basic Textarea</Label>
					<TextArea placeholder="Enter your message" />
				</TextField>
				<TextField>
					<Label>Comments</Label>
					<TextArea placeholder="Share your thoughts..." className="min-h-[100px]" />
					<Description>Maximum 500 characters allowed.</Description>
				</TextField>
				<TextField>
					<Label>Bio</Label>
					<Description>Tell us about yourself in a few sentences.</Description>
					<TextArea placeholder="I am a..." className="min-h-[120px]" />
				</TextField>
				<TextField isInvalid>
					<Label>Invalid Textarea</Label>
					<TextArea placeholder="This field has an error" />
					<FieldError>This field contains validation errors.</FieldError>
				</TextField>
				<TextField isDisabled>
					<Label>Disabled Field</Label>
					<TextArea placeholder="Cannot edit" />
					<Description>This field is currently disabled.</Description>
				</TextField>
			</FieldGroup>
		</Example>
	);
}

function SelectFields() {
	return (
		<Example title="Select Fields">
			<FieldGroup>
				<Select placeholder="Choose an option">
					<Label>Basic Select</Label>
					<SelectTrigger />
					<SelectContent>
						<SelectItem id="option1">Option 1</SelectItem>
						<SelectItem id="option2">Option 2</SelectItem>
						<SelectItem id="option3">Option 3</SelectItem>
					</SelectContent>
				</Select>
				<Select placeholder="Select your country">
					<Label>Country</Label>
					<SelectTrigger />
					<SelectContent>
						<SelectItem id="us">United States</SelectItem>
						<SelectItem id="uk">United Kingdom</SelectItem>
						<SelectItem id="ca">Canada</SelectItem>
					</SelectContent>
					<Description>Select the country where you currently reside.</Description>
				</Select>
				<Select placeholder="Select timezone">
					<Label>Timezone</Label>
					<Description>Choose your local timezone for accurate scheduling.</Description>
					<SelectTrigger />
					<SelectContent>
						<SelectItem id="utc">UTC</SelectItem>
						<SelectItem id="est">Eastern Time</SelectItem>
						<SelectItem id="pst">Pacific Time</SelectItem>
					</SelectContent>
				</Select>
				<Select placeholder="This field has an error" isInvalid>
					<Label>Invalid Select</Label>
					<SelectTrigger />
					<SelectContent>
						<SelectItem id="option1">Option 1</SelectItem>
						<SelectItem id="option2">Option 2</SelectItem>
						<SelectItem id="option3">Option 3</SelectItem>
					</SelectContent>
					<FieldError>This field contains validation errors.</FieldError>
				</Select>
				<Select placeholder="Cannot select" isDisabled>
					<Label>Disabled Field</Label>
					<SelectTrigger />
					<SelectContent>
						<SelectItem id="option1">Option 1</SelectItem>
						<SelectItem id="option2">Option 2</SelectItem>
						<SelectItem id="option3">Option 3</SelectItem>
					</SelectContent>
					<Description>This field is currently disabled.</Description>
				</Select>
			</FieldGroup>
		</Example>
	);
}

function CheckboxFields() {
	return (
		<Example title="Checkbox Fields">
			<FieldGroup>
				<Checkbox defaultSelected>
					<CheckboxControl />
					<Label>I agree to the terms and conditions</Label>
				</Checkbox>
				<Checkbox>
					<CheckboxControl />
					<FieldContent>
						<Label>Subscribe to newsletter</Label>
						<Description>Receive weekly updates about new features and promotions.</Description>
					</FieldContent>
				</Checkbox>
				<Checkbox>
					<CheckboxControl />
					<FieldContent>
						<Label>Enable Touch ID</Label>
						<Description>Enable Touch ID to quickly unlock your device.</Description>
					</FieldContent>
				</Checkbox>
				<Fieldset>
					<Legend>Preferences</Legend>
					<Description>Select all that apply to customize your experience.</Description>
					<FieldGroup className="gap-3">
						<Checkbox>
							<CheckboxControl />
							<Label>Dark mode</Label>
						</Checkbox>
						<Checkbox>
							<CheckboxControl />
							<Label>Compact view</Label>
						</Checkbox>
						<Checkbox>
							<CheckboxControl />
							<Label>Enable notifications</Label>
						</Checkbox>
					</FieldGroup>
				</Fieldset>
				<Checkbox isInvalid>
					<CheckboxControl />
					<Label>Invalid checkbox</Label>
				</Checkbox>
				<Checkbox isDisabled>
					<CheckboxControl />
					<Label>Disabled checkbox</Label>
				</Checkbox>
			</FieldGroup>
		</Example>
	);
}

function RadioFields() {
	return (
		<Example title="Radio Fields">
			<FieldGroup>
				<RadioGroup defaultValue="free">
					<Label>Subscription Plan</Label>
					<FieldGroup>
						<Radio value="free">
							<RadioControl />
							<Label>Free Plan</Label>
						</Radio>
						<Radio value="pro">
							<RadioControl />
							<Label>Pro Plan</Label>
						</Radio>
						<Radio value="enterprise">
							<RadioControl />
							<Label>Enterprise</Label>
						</Radio>
					</FieldGroup>
				</RadioGroup>
				<RadioGroup>
					<Label>Battery Level</Label>
					<Description>Choose your preferred battery level.</Description>
					<FieldGroup>
						<Radio value="high">
							<RadioControl />
							<Label>High</Label>
						</Radio>
						<Radio value="medium">
							<RadioControl />
							<Label>Medium</Label>
						</Radio>
						<Radio value="low">
							<RadioControl />
							<Label>Low</Label>
						</Radio>
					</FieldGroup>
				</RadioGroup>
				<RadioGroup>
					<FieldGroup className="gap-6">
						<Radio value="touch-id">
							<RadioControl>
								<RadioIndicator />
								<FieldContent>
									<Label>Enable Touch ID</Label>
									<Description>Enable Touch ID to quickly unlock your device.</Description>
								</FieldContent>
							</RadioControl>
						</Radio>
					</FieldGroup>
				</RadioGroup>
				<RadioGroup isInvalid>
					<Label>Invalid Radio Group</Label>
					<FieldGroup>
						<Radio value="invalid1">
							<RadioControl />
							<Label>Invalid Option 1</Label>
						</Radio>
						<Radio value="invalid2">
							<RadioControl />
							<Label>Invalid Option 2</Label>
						</Radio>
					</FieldGroup>
					<FieldError>Please select a valid option.</FieldError>
				</RadioGroup>
				<RadioGroup isDisabled>
					<Label>Disabled Radio Group</Label>
					<FieldGroup>
						<Radio value="disabled1">
							<RadioControl />
							<Label>Disabled Option 1</Label>
						</Radio>
						<Radio value="disabled2">
							<RadioControl />
							<Label>Disabled Option 2</Label>
						</Radio>
					</FieldGroup>
				</RadioGroup>
			</FieldGroup>
		</Example>
	);
}

function SwitchFields() {
	return (
		<Example title="Switch Fields">
			<FieldGroup>
				<Field orientation="horizontal">
					<FieldContent>
						<Label>Airplane Mode</Label>
						<Description>Turn on airplane mode to disable all connections.</Description>
					</FieldContent>
					<Switch aria-label="Airplane Mode">
						<SwitchControl />
					</Switch>
				</Field>
				<Switch>
					<SwitchControl />
					<Label>Dark Mode</Label>
				</Switch>
				<Switch>
					<SwitchControl />
					<FieldContent>
						<Label>Marketing Emails</Label>
						<Description>Receive emails about new products, features, and more.</Description>
					</FieldContent>
				</Switch>
				<Field>
					<Label>Privacy Settings</Label>
					<Description>Manage your privacy preferences.</Description>
					<FieldGroup className="gap-3">
						<Switch defaultSelected>
							<SwitchControl />
							<Label>Make profile visible to others</Label>
						</Switch>
						<Switch>
							<SwitchControl />
							<Label>Show email on profile</Label>
						</Switch>
					</FieldGroup>
				</Field>
				<Field orientation="horizontal">
					<FieldContent>
						<Label>Invalid Switch</Label>
						<Description>This switch has validation errors.</Description>
					</FieldContent>
					<Switch isInvalid aria-label="Invalid Switch">
						<SwitchControl />
					</Switch>
				</Field>
				<Field orientation="horizontal">
					<FieldContent>
						<Label>Disabled Switch</Label>
						<Description>This switch is currently disabled.</Description>
					</FieldContent>
					<Switch isDisabled aria-label="Disabled Switch">
						<SwitchControl />
					</Switch>
				</Field>
			</FieldGroup>
		</Example>
	);
}

function SliderFields() {
	return (
		<Example title="Slider Fields">
			<FieldGroup>
				<Slider defaultValue={50}>
					<Label>Volume</Label>
					<SliderControl />
				</Slider>
				<Slider defaultValue={75} step={5}>
					<Label>Screen Brightness</Label>
					<SliderControl />
					<Description>Adjust the screen brightness.</Description>
				</Slider>
				<Slider defaultValue={720} minValue={360} maxValue={1080} step={360}>
					<Label>Video Quality</Label>
					<Description>Higher quality uses more bandwidth.</Description>
					<SliderControl />
				</Slider>
				<Slider defaultValue={[25, 75]} step={5}>
					<Label>Price Range</Label>
					<SliderControl />
					<Description>Pick a minimum and maximum value.</Description>
				</Slider>
				<Slider defaultValue={30} aria-invalid="true">
					<Label>Invalid Slider</Label>
					<SliderControl />
					<FieldError>This slider has validation errors.</FieldError>
				</Slider>
				<Slider defaultValue={50} isDisabled>
					<Label>Disabled Slider</Label>
					<SliderControl />
					<Description>This slider is currently disabled.</Description>
				</Slider>
			</FieldGroup>
		</Example>
	);
}

function HorizontalFields() {
	return (
		<Example title="Horizontal Fields">
			<FieldGroup className="**:data-[slot=field-content]:min-w-48">
				<Field orientation="horizontal">
					<FieldContent>
						<Label>Username</Label>
						<Description>Enter your preferred username.</Description>
					</FieldContent>
					<TextField aria-label="Username">
						<Input placeholder="johndoe" />
					</TextField>
				</Field>
				<Field orientation="horizontal">
					<FieldContent>
						<Label>Bio</Label>
						<Description>Write a short description about yourself.</Description>
					</FieldContent>
					<TextField aria-label="Bio">
						<TextArea placeholder="Tell us about yourself..." />
					</TextField>
				</Field>
				<Field orientation="horizontal">
					<FieldContent>
						<Label>Email Notifications</Label>
						<Description>Receive email updates about your account.</Description>
					</FieldContent>
					<Switch aria-label="Email Notifications">
						<SwitchControl />
					</Switch>
				</Field>
				<Field orientation="horizontal">
					<FieldContent>
						<Label>Favorite Fruit</Label>
						<Description>Choose your favorite fruit.</Description>
					</FieldContent>
					<Select aria-label="Favorite Fruit" placeholder="Select a fruit">
						<SelectTrigger />
						<SelectContent>
							<SelectItem id="apple">Apple</SelectItem>
							<SelectItem id="banana">Banana</SelectItem>
							<SelectItem id="orange">Orange</SelectItem>
						</SelectContent>
					</Select>
				</Field>
				<Field orientation="horizontal">
					<FieldContent>
						<Label>Volume</Label>
						<Description>Adjust the volume level.</Description>
					</FieldContent>
					<Slider defaultValue={50} aria-label="Volume" className="w-full">
						<SliderControl />
					</Slider>
				</Field>
			</FieldGroup>
		</Example>
	);
}
