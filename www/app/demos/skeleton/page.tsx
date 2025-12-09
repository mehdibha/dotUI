import { Button } from "@dotui/registry/ui/button";
import { Description, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { SkeletonProvider } from "@dotui/registry/ui/skeleton";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Page() {
	return (
		<SkeletonProvider isLoading>
			<div className="space-y-4">
				<TextField>
					<Label>Email</Label>
					<Input />
					<Description>Enter your email.</Description>
				</TextField>
				<TextField>
					<Label>Password</Label>
					<Input />
					<Description>Enter your password.</Description>
				</TextField>
				<Button className="w-full">Submit</Button>
			</div>
		</SkeletonProvider>
	);
}
