import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { Button } from "@/registry/ui/button";
import { Description, Field, FieldGroup, Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/ui/select";
import { TextField } from "@/registry/ui/text-field";

export default function InputExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<InputBasic />
			<InputInvalid />
			<InputWithLabel />
			<InputWithDescription />
			<InputDisabled />
			<InputTypes />
			<InputWithSelect />
			<InputWithButton />
			<InputForm />
		</Examples>
	);
}

function InputBasic() {
	return (
		<Example title="Basic">
			<Input type="email" placeholder="Email" />
		</Example>
	);
}

function InputInvalid() {
	return (
		<Example title="Invalid">
			<TextField isInvalid>
				<Input type="text" placeholder="Error" />
			</TextField>
		</Example>
	);
}

function InputWithLabel() {
	return (
		<Example title="With Label">
			<TextField>
				<Label>Email</Label>
				<Input type="email" placeholder="name@example.com" />
			</TextField>
		</Example>
	);
}

function InputWithDescription() {
	return (
		<Example title="With Description">
			<TextField>
				<Label>Username</Label>
				<Input type="text" placeholder="Enter your username" />
				<Description>Choose a unique username for your account.</Description>
			</TextField>
		</Example>
	);
}

function InputDisabled() {
	return (
		<Example title="Disabled">
			<TextField isDisabled>
				<Label>Email</Label>
				<Input type="email" placeholder="Email" />
			</TextField>
		</Example>
	);
}

function InputTypes() {
	return (
		<Example title="Input Types">
			<div className="flex w-full flex-col gap-6">
				<TextField>
					<Label>Password</Label>
					<Input type="password" placeholder="Password" />
				</TextField>
				<TextField>
					<Label>Phone</Label>
					<Input type="tel" placeholder="+1 (555) 123-4567" />
				</TextField>
				<TextField>
					<Label>URL</Label>
					<Input type="url" placeholder="https://example.com" />
				</TextField>
				<TextField>
					<Label>Search</Label>
					<Input type="search" placeholder="Search" />
				</TextField>
				<TextField>
					<Label>Number</Label>
					<Input type="number" placeholder="123" />
				</TextField>
				<TextField>
					<Label>Date</Label>
					<Input type="date" />
				</TextField>
				<TextField>
					<Label>Time</Label>
					<Input type="time" />
				</TextField>
				<TextField>
					<Label>File</Label>
					<Input type="file" />
				</TextField>
			</div>
		</Example>
	);
}

function InputWithSelect() {
	return (
		<Example title="With Select">
			<div className="flex w-full gap-2">
				<Input type="text" placeholder="Enter amount" className="flex-1" />
				<Select aria-label="Currency" defaultSelectedKey="usd">
					<SelectTrigger className="w-32">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem id="usd">USD</SelectItem>
						<SelectItem id="eur">EUR</SelectItem>
						<SelectItem id="gbp">GBP</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</Example>
	);
}

function InputWithButton() {
	return (
		<Example title="With Button">
			<div className="flex w-full gap-2">
				<Input type="search" placeholder="Search..." className="flex-1" />
				<Button>Search</Button>
			</div>
		</Example>
	);
}

function InputForm() {
	return (
		<Example title="Form">
			<form className="w-full">
				<FieldGroup>
					<TextField>
						<Label>Name</Label>
						<Input type="text" placeholder="John Doe" />
					</TextField>
					<TextField>
						<Label>Email</Label>
						<Input type="email" placeholder="john@example.com" />
						<Description>We&apos;ll never share your email with anyone.</Description>
					</TextField>
					<div className="grid grid-cols-2 gap-4">
						<TextField>
							<Label>Phone</Label>
							<Input type="tel" placeholder="+1 (555) 123-4567" />
						</TextField>
						<Select defaultSelectedKey="us">
							<Label>Country</Label>
							<SelectTrigger />
							<SelectContent>
								<SelectItem id="us">United States</SelectItem>
								<SelectItem id="uk">United Kingdom</SelectItem>
								<SelectItem id="ca">Canada</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<TextField>
						<Label>Address</Label>
						<Input type="text" placeholder="123 Main St" />
					</TextField>
					<Field orientation="horizontal">
						<Button type="button" variant="default">
							Cancel
						</Button>
						<Button type="submit" variant="primary">
							Submit
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</Example>
	);
}
