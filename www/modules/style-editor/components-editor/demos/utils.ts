import { registry } from "@dotui/registry";

export function getComponentVariants(componentName: string): { name: string; label: string }[] {
	const component = registry.find((item) => item.name === componentName);

	if (!component?.variants) {
		return [];
	}

	return Object.keys(component.variants).map((variantName) => ({
		name: variantName,
		label: variantName
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" "),
	}));
}
