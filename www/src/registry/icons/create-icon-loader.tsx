"use client";

import { use } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

type IconModule = Record<string, unknown>;
type LibraryImporter = () => Promise<IconModule>;

const libraryImporters: Record<string, LibraryImporter> = {
	hugeicons: () => import("./__hugeicons__"),
	tabler: () => import("./__tabler__"),
	remix: () => import("./__remix__"),
};

const iconPromiseCaches = new Map<string, Map<string, Promise<unknown>>>();

function getCache(libraryName: string) {
	let cache = iconPromiseCaches.get(libraryName);
	if (!cache) {
		cache = new Map();
		iconPromiseCaches.set(libraryName, cache);
	}
	return cache;
}

function isIconData(data: unknown): data is IconSvgElement {
	return Array.isArray(data);
}

export function createIconLoader(libraryName: string) {
	const cache = getCache(libraryName);
	const importFn = libraryImporters[libraryName];

	if (!importFn) {
		throw new Error(`Unknown icon library: ${libraryName}`);
	}

	return function IconLoader({
		name,
		...props
	}: {
		name: string;
	} & Record<string, unknown>) {
		let promise = cache.get(name);
		if (!promise) {
			promise = importFn().then((mod) => {
				return mod[name] || null;
			});
			cache.set(name, promise);
		}

		const iconData = use(promise);

		if (!iconData) {
			return null;
		}

		if (isIconData(iconData)) {
			return <HugeiconsIcon icon={iconData} {...props} />;
		}

		const IconComponent = iconData as React.ComponentType<Record<string, unknown>>;
		return <IconComponent {...props} />;
	};
}
