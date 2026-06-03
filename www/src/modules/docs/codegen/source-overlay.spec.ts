import { describe, expect, it } from "vitest";

import { renderCode } from "./code-template";
import { buildSourceOverlay, type ControlSelection } from "./source-overlay";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function gen(source: string, controls: ControlSelection[], values: Record<string, unknown>) {
	const template = await buildSourceOverlay({ source, controls, componentName: "test" });
	return {
		collapsed: renderCode(template, values, { expanded: false }),
		expanded: renderCode(template, values, { expanded: true }),
		template,
	};
}

// ---------------------------------------------------------------------------
// BUTTON — children + enums + booleans, self-close when children cleared
// ---------------------------------------------------------------------------

const BUTTON_SRC = `"use client";

import { Button } from "@/registry/ui/button";

export default function Demo({
	children = "Button",
	variant = "default",
	size = "md",
	isDisabled = false,
	isPending = false,
} = {}) {
	return (
		<Button variant={variant} size={size} isDisabled={isDisabled} isPending={isPending}>
			{children}
		</Button>
	);
}
`;

const BUTTON_CONTROLS: ControlSelection[] = [
	{ name: "children", kind: "string", default: "Button" },
	{ name: "variant", kind: "enum", default: "default" },
	{ name: "size", kind: "enum", default: "md" },
	{ name: "isDisabled", kind: "boolean", default: false },
	{ name: "isPending", kind: "boolean", default: false },
];

describe("button", () => {
	it("non-default config: variant=primary size=lg isDisabled", async () => {
		const { collapsed, expanded } = await gen(BUTTON_SRC, BUTTON_CONTROLS, {
			children: "Button",
			variant: "primary",
			size: "lg",
			isDisabled: true,
			isPending: false,
		});
		expect(collapsed).toBe(`<Button variant="primary" size="lg" isDisabled>
  Button
</Button>`);
		expect(expanded).toBe(`import { Button } from "@/components/ui/button";

export function Demo() {
  return (
    <Button variant="primary" size="lg" isDisabled>
      Button
    </Button>
  );
}`);
	});

	it("all defaults: only children shown", async () => {
		const { collapsed } = await gen(BUTTON_SRC, BUTTON_CONTROLS, {
			children: "Button",
			variant: "default",
			size: "md",
			isDisabled: false,
			isPending: false,
		});
		expect(collapsed).toBe(`<Button>
  Button
</Button>`);
	});

	it("empty children self-closes", async () => {
		const { collapsed } = await gen(BUTTON_SRC, BUTTON_CONTROLS, {
			children: "",
			variant: "default",
			size: "md",
			isDisabled: false,
			isPending: false,
		});
		expect(collapsed).toBe(`<Button />`);
	});
});

// ---------------------------------------------------------------------------
// SWITCH — compound child (<SwitchControl />) + conditional <Label> slot
// ---------------------------------------------------------------------------

const SWITCH_SRC = `"use client";

import { Label } from "@/registry/ui/field";
import { Switch, SwitchControl } from "@/registry/ui/switch";

export default function Demo({ label = "Airplane mode", size = "md", isDisabled = false, isReadOnly = false } = {}) {
	return (
		<Switch size={size} isDisabled={isDisabled} isReadOnly={isReadOnly}>
			<SwitchControl />
			{label && <Label>{label}</Label>}
		</Switch>
	);
}
`;

const SWITCH_CONTROLS: ControlSelection[] = [
	{ name: "label", kind: "string", default: "Airplane mode" },
	{ name: "size", kind: "enum", default: "md" },
	{ name: "isDisabled", kind: "boolean", default: false },
	{ name: "isReadOnly", kind: "boolean", default: false },
];

describe("switch", () => {
	it("size=lg isDisabled, default label shown via slot", async () => {
		const { collapsed, expanded } = await gen(SWITCH_SRC, SWITCH_CONTROLS, {
			label: "Airplane mode",
			size: "lg",
			isDisabled: true,
			isReadOnly: false,
		});
		expect(collapsed).toBe(`<Switch size="lg" isDisabled>
  <SwitchControl />
  <Label>Airplane mode</Label>
</Switch>`);
		expect(expanded).toBe(`import { Label } from "@/components/ui/field";
import { Switch, SwitchControl } from "@/components/ui/switch";

export function Demo() {
  return (
    <Switch size="lg" isDisabled>
      <SwitchControl />
      <Label>Airplane mode</Label>
    </Switch>
  );
}`);
	});

	it("empty label drops the slot but keeps SwitchControl", async () => {
		const { collapsed } = await gen(SWITCH_SRC, SWITCH_CONTROLS, {
			label: "",
			size: "md",
			isDisabled: false,
			isReadOnly: false,
		});
		expect(collapsed).toBe(`<Switch>
  <SwitchControl />
</Switch>`);
	});
});

// ---------------------------------------------------------------------------
// SELECT — string attr (placeholder) dropped at default; label slot shown
// ---------------------------------------------------------------------------

const SELECT_SRC = `"use client";

import { Label } from "@/registry/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

export default function Demo({
	label = "Country",
	placeholder = "Select a country",
	isDisabled = false,
	isInvalid = false,
} = {}) {
	return (
		<Select placeholder={placeholder} isDisabled={isDisabled} isInvalid={isInvalid}>
			{label && <Label>{label}</Label>}
			<SelectTrigger />
			<SelectContent>
				<SelectItem id="us">United States</SelectItem>
				<SelectItem id="uk">United Kingdom</SelectItem>
			</SelectContent>
		</Select>
	);
}
`;

const SELECT_CONTROLS: ControlSelection[] = [
	{ name: "label", kind: "string", default: "Country" },
	{ name: "placeholder", kind: "string", default: "Select a country" },
	{ name: "isDisabled", kind: "boolean", default: false },
	{ name: "isInvalid", kind: "boolean", default: false },
];

describe("select", () => {
	it("isDisabled; placeholder at default dropped; label shown as plain text", async () => {
		const { collapsed } = await gen(SELECT_SRC, SELECT_CONTROLS, {
			label: "Country",
			placeholder: "Select a country",
			isDisabled: true,
			isInvalid: false,
		});
		expect(collapsed).toBe(`<Select isDisabled>
  <Label>Country</Label>
  <SelectTrigger />
  <SelectContent>
    <SelectItem id="us">United States</SelectItem>
    <SelectItem id="uk">United Kingdom</SelectItem>
  </SelectContent>
</Select>`);
	});

	it("custom placeholder shown; empty label drops slot", async () => {
		const { collapsed } = await gen(SELECT_SRC, SELECT_CONTROLS, {
			label: "",
			placeholder: "Pick one",
			isDisabled: false,
			isInvalid: false,
		});
		expect(collapsed).toBe(`<Select placeholder="Pick one">
  <SelectTrigger />
  <SelectContent>
    <SelectItem id="us">United States</SelectItem>
    <SelectItem id="uk">United Kingdom</SelectItem>
  </SelectContent>
</Select>`);
	});
});

// ---------------------------------------------------------------------------
// ACCORDION — top-level const + {items.map}; collapsed placeholders the const
// ---------------------------------------------------------------------------

const ACCORDION_SRC = `"use client";

import { Accordion } from "@/registry/ui/accordion";
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/registry/ui/disclosure";

const items = [
	{ id: "a", question: "Q one?", answer: "A one." },
	{ id: "b", question: "Q two?", answer: "A two." },
];

export default function Demo({ allowsMultipleExpanded = false, isDisabled = false } = {}) {
	return (
		<Accordion allowsMultipleExpanded={allowsMultipleExpanded} isDisabled={isDisabled} className="max-w-2xl">
			{items.map((item) => (
				<Disclosure id={item.id} key={item.id}>
					<DisclosureTrigger>{item.question}</DisclosureTrigger>
					<DisclosurePanel>{item.answer}</DisclosurePanel>
				</Disclosure>
			))}
		</Accordion>
	);
}
`;

const ACCORDION_CONTROLS: ControlSelection[] = [
	{ name: "allowsMultipleExpanded", kind: "boolean", default: false },
	{ name: "isDisabled", kind: "boolean", default: false },
];

describe("accordion", () => {
	it("allowsMultipleExpanded; const placeholdered in collapsed, real in expanded", async () => {
		const { collapsed, expanded } = await gen(ACCORDION_SRC, ACCORDION_CONTROLS, {
			allowsMultipleExpanded: true,
			isDisabled: false,
		});
		// The open tag MUST stay on ONE line (widest-concrete keeps it ≤ printWidth).
		expect(collapsed).toBe(`const items = /* ... */;

<Accordion allowsMultipleExpanded className="max-w-2xl">
  {items.map((item) => (
    <Disclosure id={item.id} key={item.id}>
      <DisclosureTrigger>{item.question}</DisclosureTrigger>
      <DisclosurePanel>{item.answer}</DisclosurePanel>
    </Disclosure>
  ))}
</Accordion>`);
		expect(expanded).toBe(`import { Accordion } from "@/components/ui/accordion";
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "@/components/ui/disclosure";

const items = [
  { id: "a", question: "Q one?", answer: "A one." },
  { id: "b", question: "Q two?", answer: "A two." },
];

export function Demo() {
  return (
    <Accordion allowsMultipleExpanded className="max-w-2xl">
      {items.map((item) => (
        <Disclosure id={item.id} key={item.id}>
          <DisclosureTrigger>{item.question}</DisclosureTrigger>
          <DisclosurePanel>{item.answer}</DisclosurePanel>
        </Disclosure>
      ))}
    </Accordion>
  );
}`);
	});
});

// ---------------------------------------------------------------------------
// TOOLTIP — nested-target: controls live on <TooltipContent>, marker stripped
// ---------------------------------------------------------------------------

const TOOLTIP_SRC = `"use client";

import { Button } from "@/registry/ui/button";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

export default function Demo({ placement = "top", hideArrow = false } = {}) {
	return (
		<Tooltip>
			<Button>Hover me</Button>
			<TooltipContent data-control-target placement={placement} hideArrow={hideArrow}>
				Tooltip content
			</TooltipContent>
		</Tooltip>
	);
}
`;

const TOOLTIP_CONTROLS: ControlSelection[] = [
	{ name: "placement", kind: "enum", default: "top" },
	{ name: "hideArrow", kind: "boolean", default: false },
];

describe("tooltip", () => {
	it("nested-target controls, data-control-target stripped", async () => {
		const { collapsed } = await gen(TOOLTIP_SRC, TOOLTIP_CONTROLS, {
			placement: "bottom",
			hideArrow: true,
		});
		expect(collapsed).toBe(`<Tooltip>
  <Button>Hover me</Button>
  <TooltipContent placement="bottom" hideArrow>
    Tooltip content
  </TooltipContent>
</Tooltip>`);
	});

	it("all default placement dropped, marker still stripped", async () => {
		const { collapsed } = await gen(TOOLTIP_SRC, TOOLTIP_CONTROLS, {
			placement: "top",
			hideArrow: false,
		});
		expect(collapsed).toBe(`<Tooltip>
  <Button>Hover me</Button>
  <TooltipContent>
    Tooltip content
  </TooltipContent>
</Tooltip>`);
	});
});

// ---------------------------------------------------------------------------
// PROGRESS-BAR — derived value attr (@control/@drop-when), markers stripped
// ---------------------------------------------------------------------------

const PROGRESS_SRC = `"use client";

import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar";

export default function Demo({ label = "Loading...", value = 60, isIndeterminate = false } = {}) {
	return (
		<ProgressBar
			/* @control:value */
			/* @drop-when:isIndeterminate */
			value={isIndeterminate ? undefined : value}
			isIndeterminate={isIndeterminate}
		>
			{label && <Label>{label}</Label>}
			<ProgressBarControl />
		</ProgressBar>
	);
}
`;

const PROGRESS_CONTROLS: ControlSelection[] = [
	{ name: "label", kind: "string", default: "Loading..." },
	{ name: "value", kind: "number", default: 60, dropWhen: "isIndeterminate" },
	{ name: "isIndeterminate", kind: "boolean", default: false },
];

describe("progress-bar", () => {
	it("determinate: value shown, isIndeterminate dropped", async () => {
		const { collapsed } = await gen(PROGRESS_SRC, PROGRESS_CONTROLS, {
			label: "Loading...",
			value: 30,
			isIndeterminate: false,
		});
		expect(collapsed).toBe(`<ProgressBar value={30}>
  <Label>Loading...</Label>
  <ProgressBarControl />
</ProgressBar>`);
	});

	it("indeterminate: value attr dropped via @drop-when", async () => {
		const { collapsed } = await gen(PROGRESS_SRC, PROGRESS_CONTROLS, {
			label: "Loading...",
			value: 30,
			isIndeterminate: true,
		});
		expect(collapsed).toBe(`<ProgressBar isIndeterminate>
  <Label>Loading...</Label>
  <ProgressBarControl />
</ProgressBar>`);
	});
});
