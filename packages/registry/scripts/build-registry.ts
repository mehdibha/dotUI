import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { rimraf } from "rimraf";

import { registryBlocks } from "../src/blocks/registry.js";
import { iconLibraries, registryIcons } from "../src/icons/registry.js";

const GENERATED_DIR = path.join(process.cwd(), "src/__generated__");

async function ensureGeneratedDir() {
	await rimraf(GENERATED_DIR);
	await fs.mkdir(GENERATED_DIR, { recursive: true });
}

async function buildBlocks() {
	const targetPath = path.join(GENERATED_DIR, "blocks.tsx");

	let content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate
import * as React from "react";

export const BlocksIndex: Record<
  string,
  {
    files: string[];
    component: React.LazyExoticComponent<React.ComponentType<object>>;
  }
> = {
`;

	for (const block of registryBlocks) {
		const blockFiles =
			block.files?.map((file) =>
				typeof file === "string" ? file : file.path,
			) || [];

		let componentPath = `@dotui/registry/blocks/${block.name}`;

		if (block.files && block.files.length > 0) {
			const files = block.files.map((file) =>
				typeof file === "string" ? { type: "registry:page", path: file } : file,
			);
			if (files[0]) {
				const firstFilePath = files[0].path.replace(/\.tsx?$/, "");
				componentPath = `@dotui/registry/${firstFilePath}`;
			}
		}

		content += `  "${block.name}": {
    files: ${JSON.stringify(blockFiles)},
    component: React.lazy(() => import("${componentPath}")),
  },
`;
	}

	content += `};
`;

	await fs.writeFile(targetPath, content, "utf8");
	console.log("  ✓ blocks.tsx");
}

async function processDirectory(
	dirPath: string,
	relativePath: string,
	entries: string[],
): Promise<void> {
	const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });

	for (const entry of dirEntries) {
		if (entry.isFile() && entry.name.endsWith(".tsx")) {
			if (entry.name === "playground.tsx") continue;

			const demoName = entry.name.replace(".tsx", "");
			const key = `${relativePath}/${demoName}`;
			const importPath = `@dotui/registry/ui/${relativePath}/${demoName}`;
			const filePath = `ui/${relativePath}/${entry.name}`;

			entries.push(`  "${key}": {
    files: ["${filePath}"],
    component: React.lazy(() => import("${importPath}")),
  },
`);
		} else if (entry.isDirectory()) {
			const subDirPath = path.join(dirPath, entry.name);
			const subRelativePath = `${relativePath}/${entry.name}`;
			await processDirectory(subDirPath, subRelativePath, entries);
		}
	}
}

async function buildDemos() {
	const targetPath = path.join(GENERATED_DIR, "demos.tsx");
	const sourcePath = path.join(process.cwd(), "src/ui");

	let content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate
import * as React from "react";

export const DemosIndex: Record<
  string,
  {
    files: string[];
    component: React.LazyExoticComponent<React.ComponentType<object>>;
  }
> = {
`;

	const componentFolders = await fs.readdir(sourcePath);
	const entries: string[] = [];

	for (const componentFolder of componentFolders) {
		const componentPath = path.join(sourcePath, componentFolder);
		const stats = await fs.stat(componentPath);

		if (!stats.isDirectory()) continue;

		const demosPath = path.join(componentPath, "demos");
		if (!existsSync(demosPath)) continue;

		await processDirectory(demosPath, `${componentFolder}/demos`, entries);
	}

	content += entries.join("");
	content += `};
`;

	await fs.writeFile(targetPath, content, "utf8");
	console.log("  ✓ demos.tsx");
}

async function buildIcons() {
	const targetPath = path.join(GENERATED_DIR, "icons.tsx");

	const iconKeys = Object.keys(registryIcons);

	const iconExports = iconKeys
		.map((iconKey) => {
			const iconMapping = registryIcons[iconKey];
			if (!iconMapping) {
				throw new Error(`Icon mapping not found for: ${iconKey}`);
			}

			const libraryMappings = iconLibraries
				.map((library) => {
					const iconName = iconMapping[library.name];
					if (!iconName) {
						throw new Error(
							`Icon "${iconKey}" not found for library "${library.name}"`,
						);
					}

					if (library.name === "lucide") {
						return `    lucide: Lucide.${iconName},`;
					}
					return `    ${library.name}: React.lazy(() => import("${library.import}").then(mod => ({ default: mod.${iconName} }))),`;
				})
				.join("\n");

			return `export const ${iconKey} = createIcon({
${libraryMappings}
});`;
		})
		.join("\n\n");

	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate
"use client";

import * as React from "react";
import * as Lucide from "lucide-react";
import { createIcon } from "@dotui/registry/icons/create-icon";

${iconExports}
`;

	await fs.writeFile(targetPath, content, "utf8");
	console.log("  ✓ icons.tsx");
}

async function cleanOldGenerated() {
	// Clean up old generated files from previous locations
	const oldFiles = [
		path.join(process.cwd(), "src/icons/__icons__.tsx"),
		path.join(process.cwd(), "src/ui/__demos__.tsx"),
		path.join(process.cwd(), "src/blocks/__blocks__.tsx"),
	];

	for (const file of oldFiles) {
		if (existsSync(file)) {
			await fs.unlink(file);
			console.log(`  🗑️  Removed old file: ${path.basename(file)}`);
		}
	}

	// Remove empty __internal__ folder if it exists
	const internalDir = path.join(process.cwd(), "src/__internal__");
	if (existsSync(internalDir)) {
		await rimraf(internalDir);
		console.log("  🗑️  Removed __internal__ folder");
	}
}

async function main() {
	console.log("🔨 Building registry...\n");

	try {
		await cleanOldGenerated();
		await ensureGeneratedDir();

		await buildBlocks();
		await buildDemos();
		await buildIcons();

		console.log("\n✅ Registry built successfully!");
	} catch (error) {
		console.error("\n❌ Error building registry:", error);
		process.exit(1);
	}
}

main();
