import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		port: 4444,
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
		viteTsConfigPaths({
			projects: ["./tsconfig.json", "../packages/registry/tsconfig.json", "../packages/core/tsconfig.json"],
		}),
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
