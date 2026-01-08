import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.tsx"],
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	external: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
	treeshake: true,
	minify: false,
});
