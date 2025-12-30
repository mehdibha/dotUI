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
  if (!iconPromiseCaches.has(libraryName)) {
    iconPromiseCaches.set(libraryName, new Map());
  }
  return iconPromiseCaches.get(libraryName)!;
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
    if (!cache.has(name)) {
      const promise = importFn().then((mod) => {
        return mod[name] || null;
      });
      cache.set(name, promise);
    }

    const iconData = use(cache.get(name)!);

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
