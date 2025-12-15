// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build:core" to regenerate

export interface FileEntry {
	type?: string;
	path: string;
	target: string;
	content: string;
}

export interface VariantData {
	files: FileEntry[];
	registryDependencies?: string[];
	dependencies?: string[];
}

export interface RegistryItemData {
	name: string;
	type?: string;
	defaultVariant?: string;
	variants?: Record<string, VariantData>;
	files?: FileEntry[];
	registryDependencies?: string[];
	dependencies?: string[];
	description?: string;
	categories?: string[];
	meta?: Record<string, unknown>;
	extends?: string;
	css?: Record<string, unknown>;
}

export interface IconLibrary {
	name: string;
	label: string;
	package: string;
	import: string;
}

export interface BlockCategory {
	name: string;
	slug: string;
}
