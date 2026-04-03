import path from "node:path";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 4444,
	},
	resolve: {
		alias: [
			{ find: /^@\/\.source\//, replacement: `${path.resolve(import.meta.dirname, ".source")}/` },
			{ find: /^@\//, replacement: `${path.resolve(import.meta.dirname, "src")}/` },
			{ find: /^@dotui\/registry\/ui\/demos$/, replacement: path.resolve(import.meta.dirname, "../packages/registry/src/__generated__/demos.tsx") },
			{ find: /^@dotui\/registry\//, replacement: `${path.resolve(import.meta.dirname, "../packages/registry/src")}/` },
			{ find: /^@dotui\/core\//, replacement: `${path.resolve(import.meta.dirname, "../packages/core/src")}/` },
		],
	},
	ssr: {
		noExternal: ["@tabler/icons-react"],
	},
	plugins: [
		mdx(await import("./source.config")),
		nitro({
			preset: process.env.VERCEL ? "vercel" : "node",
			rollupConfig: {
				onwarn(warning, warn) {
					if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes('"use client"')) {
						return;
					}
					if (warning.code === "EMPTY_BUNDLE") {
						return;
					}
					warn(warning);
				},
			},
		}),
		tailwindcss(),
		devtools(),
		tanstackStart({
			prerender: {
				enabled: true,
				filter: ({ path }) => !path.includes("?"),
			},
		}),
		viteReact(),
	],
});
