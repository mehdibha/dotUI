import path from "node:path";

import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: [
			{ find: /^@\/\.source\//, replacement: `${path.resolve(import.meta.dirname, "www/.source")}/` },
			{ find: /^@\//, replacement: `${path.resolve(import.meta.dirname, "www/src")}/` },
		],
	},
	test: {
		exclude: [...configDefaults.exclude, "**/node_modules/**", "**/fixtures/**", "**/templates/**"],
	},
});
