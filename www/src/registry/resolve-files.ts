import type { RegistryItem, RegistryItemFile } from "./types";

function getFileKey(file: RegistryItemFile) {
	return file.target ?? file.path;
}

function setFiles(filesByKey: Map<string, RegistryItemFile>, files: readonly RegistryItemFile[] | undefined) {
	for (const file of files ?? []) {
		filesByKey.set(getFileKey(file), file);
	}
}

function resolveRegistryItemFiles(item: RegistryItem, selectedParams: Record<string, string> = {}): RegistryItemFile[] {
	const filesByKey = new Map<string, RegistryItemFile>();
	setFiles(filesByKey, item.files);

	for (const [paramName, paramDef] of Object.entries(item.params ?? {})) {
		if (paramDef.kind !== "enum" || !paramDef.files) continue;

		const selectedValue = selectedParams[paramName] ?? paramDef.default;
		setFiles(filesByKey, paramDef.files[selectedValue]);
	}

	return [...filesByKey.values()];
}

export { resolveRegistryItemFiles };
