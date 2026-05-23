import type { Density, RegistryItem } from "@/registry/types";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

function mergeValues(baseValue: unknown, overrideValue: unknown): unknown {
	if (typeof baseValue === "string" && typeof overrideValue === "string") {
		return `${baseValue} ${overrideValue}`.trim();
	}

	if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
		return [...baseValue, ...overrideValue];
	}

	if (isRecord(baseValue) && isRecord(overrideValue)) {
		return mergeRecords(baseValue, overrideValue);
	}

	return overrideValue;
}

function mergeRecords(base: JsonRecord, override: JsonRecord): JsonRecord {
	const merged: JsonRecord = { ...base };
	for (const [key, overrideValue] of Object.entries(override)) {
		const baseValue = merged[key];
		merged[key] = baseValue === undefined ? overrideValue : mergeValues(baseValue, overrideValue);
	}
	return merged;
}

export function flattenStylesConfig(
	stylesConfig: JsonRecord,
	meta: Pick<RegistryItem, "params" | "name">,
	options: { density: Density; componentParams: Record<string, string> },
): JsonRecord {
	const base = isRecord(stylesConfig.base) ? stylesConfig.base : {};
	const densities = isRecord(stylesConfig.density) ? stylesConfig.density : {};
	const params = isRecord(stylesConfig.params) ? stylesConfig.params : {};

	let flattened = mergeRecords({}, base);

	const densityConfig = densities[options.density];
	if (isRecord(densityConfig)) {
		flattened = mergeRecords(flattened, densityConfig);
	}

	for (const [paramName, def] of Object.entries(meta.params ?? {})) {
		if (def.kind !== "enum") continue;
		const selected = options.componentParams[paramName] ?? def.default;
		const paramValues = params[paramName];
		if (!isRecord(paramValues)) continue;
		const selectedConfig = paramValues[selected];
		if (isRecord(selectedConfig)) {
			flattened = mergeRecords(flattened, selectedConfig);
		}
	}

	return flattened;
}
