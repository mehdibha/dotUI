import fs from "node:fs/promises";
import path from "node:path";
import { highlight } from "fumadocs-core/highlight";

import { Index } from "@dotui/registry/ui/demos";

import { Pre } from "@/modules/docs/code-block";

import { transformDemo } from "./transformer";

export const loadDemo = async (name: string) => {
	const demo = Index[name];
	if (!demo) throw new Error(`Demo ${name} not found`);

	const filePath = demo.files[0];
	if (!filePath) throw new Error(`File path not found for demo ${name}`);

	const rawContent = await getFileSource(filePath);
	const { source, preview } = transformDemo(rawContent);

	const [highlightedSource, highlightedPreview] = await Promise.all([
		highlightSource(source),
		highlightSource(preview),
	]);

	return {
		component: demo.component,
		highlightedSource,
		highlightedPreview,
	};
};

const highlightSource = (source: string) =>
	highlight(source, {
		lang: "tsx",
		components: {
			pre: (props) => <Pre {...props} />,
		},
	});

const getFileSource = async (filePath: string) => {
	const fullPath = path.join(process.cwd(), "..", "packages", "registry", "src", filePath);
	return fs.readFile(fullPath, "utf-8");
};
