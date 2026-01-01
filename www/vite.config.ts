import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		mdx(await import("./source.config")),
		// nitro must come before tanstackStart for prerendering to work
		nitro({
			preset: "node",
		}),
		tailwindcss(),
		viteTsConfigPaths({
			projects: ["./tsconfig.json", "../packages/registry/tsconfig.json", "../packages/core/tsconfig.json"],
		}),
		devtools(),
		tanstackStart({
			prerender: {
				enabled: true,
				filter: ({ path }) => !path.startsWith("/og"),
			},
		}),
		viteReact(),
	]
});
