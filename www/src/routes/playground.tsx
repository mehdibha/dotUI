import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";
import type * as React from "react";

import { Checkbox, CheckboxControl, CheckboxIndicator } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { Description, FieldContent, FieldError, FieldGroup, Label } from "@/registry/ui/field";

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
});

function ExampleSection({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="flex flex-col gap-3 rounded-lg border border-border p-4">
			<h2 className="font-medium text-fg text-sm">{title}</h2>
			<div className="flex flex-col items-start gap-3">{children}</div>
		</section>
	);
}

function RouteComponent() {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-8">
			<div className="space-y-2">
				<h1 className="font-semibold text-2xl">Checkbox Composition Playground</h1>
				<p className="text-fg-muted text-sm">Each example maps to one supported checkbox DOM shape.</p>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<ExampleSection title="Standalone">
					<Checkbox aria-label="Enable notifications" defaultSelected />
				</ExampleSection>

				<ExampleSection title="Shorthand">
					<Checkbox>Enable notifications</Checkbox>
				</ExampleSection>

				<ExampleSection title="Inline label">
					<Checkbox>
						<CheckboxControl />
						<Label>Enable notifications</Label>
					</Checkbox>
				</ExampleSection>

				<ExampleSection title="Inline with description">
					<Checkbox defaultSelected>
						<CheckboxControl />
						<FieldContent>
							<Label>Enable notifications</Label>
							<Description>You can disable them later.</Description>
						</FieldContent>
					</Checkbox>
				</ExampleSection>

				<ExampleSection title="Card checkbox">
					<Checkbox className="w-full">
						<CheckboxControl>
							<CheckboxIndicator />
							<FieldContent>
								<Label>Enable notifications</Label>
								<Description>You can disable them later.</Description>
							</FieldContent>
						</CheckboxControl>
					</Checkbox>
				</ExampleSection>

				<ExampleSection title="Custom indicator">
					<Checkbox>
						<CheckboxControl>
							<CheckboxIndicator>
								<CheckIcon aria-hidden />
							</CheckboxIndicator>
						</CheckboxControl>
						<Label>Enable notifications</Label>
					</Checkbox>
				</ExampleSection>

				<ExampleSection title="Checkbox group">
					<CheckboxGroup defaultValue={["nextjs"]} isInvalid className="w-full">
						<Label>React frameworks</Label>
						<Description>Pick any frameworks.</Description>
						<FieldGroup>
							<Checkbox value="nextjs">
								<CheckboxControl />
								<Label>Next.js</Label>
							</Checkbox>
							<Checkbox value="remix">
								<CheckboxControl />
								<Label>Remix</Label>
							</Checkbox>
							<Checkbox value="gatsby">
								<CheckboxControl />
								<Label>Gatsby</Label>
							</Checkbox>
						</FieldGroup>
						<FieldError>Please select a framework.</FieldError>
					</CheckboxGroup>
				</ExampleSection>

				<ExampleSection title="Card checkbox group">
					<CheckboxGroup defaultValue={["nextjs"]} className="w-full">
						<Label>React frameworks</Label>
						<FieldGroup>
							<Checkbox value="nextjs">
								<CheckboxControl>
									<CheckboxIndicator />
									<FieldContent>
										<Label>Next.js</Label>
										<Description>The React framework for the web.</Description>
									</FieldContent>
								</CheckboxControl>
							</Checkbox>
							<Checkbox value="remix">
								<CheckboxControl>
									<CheckboxIndicator />
									<FieldContent>
										<Label>Remix</Label>
										<Description>Full stack web framework.</Description>
									</FieldContent>
								</CheckboxControl>
							</Checkbox>
						</FieldGroup>
					</CheckboxGroup>
				</ExampleSection>
			</div>
		</div>
	);
}
