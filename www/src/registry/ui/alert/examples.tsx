import { CheckIcon, CircleAlert, CircleAlertIcon, InfoIcon } from "lucide-react";

import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/registry/ui/alert";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/ui/select";
import { TextField } from "@/registry/ui/text-field";

export default function AlertExample() {
	return (
		<Examples className="lg:grid-cols-1">
			<AlertExample1 />
			<AlertExample2 />
			<AlertExample3 />
			<AlertExample4 />
			<AlertExample5 />
		</Examples>
	);
}

function AlertExample1() {
	return (
		<Example title="Basic">
			<div className="mx-auto flex w-full max-w-lg flex-col gap-4">
				<Alert>
					<AlertTitle>Success! Your changes have been saved.</AlertTitle>
				</Alert>
				<Alert>
					<AlertTitle>Success! Your changes have been saved.</AlertTitle>
					<AlertDescription>This is an alert with title and description.</AlertDescription>
				</Alert>
				<Alert>
					<AlertDescription>This one has a description only. No title. No icon.</AlertDescription>
				</Alert>
			</div>
		</Example>
	);
}

function AlertExample2() {
	return (
		<Example title="Variants">
			<div className="mx-auto flex w-full max-w-lg flex-col gap-4">
				<Alert variant="danger">
					<CircleAlert />
					<AlertTitle>Something went wrong!</AlertTitle>
					<AlertDescription>Your session has expired. Please log in again.</AlertDescription>
				</Alert>
				<Alert variant="danger">
					<CircleAlert />
					<AlertTitle>Unable to process your payment.</AlertTitle>
					<AlertDescription>
						<p>
							Please verify your <a href="#">billing information</a> and try again.
						</p>
						<ul className="list-inside list-disc">
							<li>Check your card details</li>
							<li>Ensure sufficient funds</li>
							<li>Verify billing address</li>
						</ul>
					</AlertDescription>
				</Alert>
				<Alert variant="warning">
					<CircleAlert />
					<AlertTitle>Something went wrong!</AlertTitle>
					<AlertDescription>Your session has expired. Please log in again.</AlertDescription>
				</Alert>
				<Alert variant="success">
					<CheckIcon />
					<AlertTitle>Your changes have been saved.</AlertTitle>
					<AlertDescription>This is an alert with title and description.</AlertDescription>
				</Alert>
			</div>
		</Example>
	);
}

function AlertExample3() {
	return (
		<Example title="With Icons">
			<div className="mx-auto flex w-full max-w-lg flex-col gap-4">
				<Alert>
					<CircleAlert />
					<AlertTitle>
						Let&apos;s try one with icon, title and a <a href="#">link</a>.
					</AlertTitle>
				</Alert>
				<Alert>
					<CircleAlert />
					<AlertDescription>
						This one has an icon and a description only. No title. <a href="#">But it has a link</a> and a{" "}
						<a href="#">second link</a>.
					</AlertDescription>
				</Alert>

				<Alert>
					<CircleAlert />
					<AlertTitle>Success! Your changes have been saved</AlertTitle>
					<AlertDescription>This is an alert with icon, title and description.</AlertDescription>
				</Alert>
				<Alert>
					<CircleAlert />
					<AlertTitle>
						This is a very long alert title that demonstrates how the component handles extended text content and
						potentially wraps across multiple lines
					</AlertTitle>
				</Alert>
				<Alert>
					<CircleAlert />
					<AlertDescription>
						This is a very long alert description that demonstrates how the component handles extended text content and
						potentially wraps across multiple lines
					</AlertDescription>
				</Alert>
				<Alert>
					<CircleAlert />
					<AlertTitle>
						This is an extremely long alert title that spans multiple lines to demonstrate how the component handles
						very lengthy headings while maintaining readability and proper text wrapping behavior
					</AlertTitle>
					<AlertDescription>
						This is an equally long description that contains detailed information about the alert. It shows how the
						component can accommodate extensive content while preserving proper spacing, alignment, and readability
						across different screen sizes and viewport widths. This helps ensure the user experience remains consistent
						regardless of the content length.
					</AlertDescription>
				</Alert>
			</div>
		</Example>
	);
}

function AlertExample4() {
	return (
		<Example title="With Actions">
			<div className="mx-auto flex w-full max-w-lg flex-col gap-4">
				<Alert>
					<CircleAlert />
					<AlertTitle>The selected emails have been marked as spam.</AlertTitle>
					<AlertAction>
						<Button variant="primary" size="xs" className="h-6">
							Undo
						</Button>
					</AlertAction>
				</Alert>
				<Alert>
					<CircleAlert />
					<AlertTitle>The selected emails have been marked as spam.</AlertTitle>
					<AlertDescription>
						This is a very long alert title that demonstrates how the component handles extended text content.
					</AlertDescription>
					<AlertAction>
						<Badge>Badge</Badge>
					</AlertAction>
				</Alert>
			</div>
		</Example>
	);
}

function AlertExample5() {
	return (
		<Example title="Inside Card">
			<Card className="mx-auto w-full max-w-lg">
				<CardHeader>
					<CardTitle>Create project</CardTitle>
					<CardDescription>Create a new project to get started.</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<Alert>
						<CircleAlertIcon />
						<AlertTitle>You have reached the limit of 3 free projects.</AlertTitle>
						<AlertDescription>Upgrade to Pro to create unlimited projects.</AlertDescription>
						<AlertAction>
							<Button variant="primary" size="xs">
								Upgrade
							</Button>
						</AlertAction>
					</Alert>
					<TextField className="flex w-full flex-col gap-2">
						<Label>Name</Label>
						<Input placeholder="My project" />
					</TextField>
					<div className="flex flex-col gap-2">
						<Label htmlFor="project-framework">Framework</Label>
						<Select placeholder="Select a framework" className="w-full">
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem id="next">Next.js</SelectItem>
								<SelectItem id="remix">Remix</SelectItem>
								<SelectItem id="astro">Astro</SelectItem>
								<SelectItem id="nuxt">Nuxt</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
				<CardFooter>
					<Button variant="primary" className="w-full">
						Create project
					</Button>
				</CardFooter>
			</Card>
		</Example>
	);
}
