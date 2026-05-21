import { Button } from "@/registry/ui/button";
import { Description, Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Skeleton } from "@/registry/ui/skeleton";
import { TextField } from "@/registry/ui/text-field";

export function SkeletonDemo() {
	return (
		<Skeleton isLoading>
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
		</Skeleton>
	);
}
