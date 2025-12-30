import { Node, Project, ScriptKind, SyntaxKind } from "ts-morph";
import type { FunctionDeclaration, SourceFile } from "ts-morph";

// ============================================================================
// Types
// ============================================================================

interface TransformResult {
	/** Full source with paths adjusted */
	source: string;
	/** Preview: top-level constants as placeholders + full function body JSX */
	preview: string;
}

interface TopLevelDeclaration {
	name: string;
	placeholder: string;
}

// ============================================================================
// Singleton Project (reused across calls for performance)
// ============================================================================

const project = new Project({ compilerOptions: {} });
let fileCounter = 0;

function createSourceFile(source: string): SourceFile {
	// Use unique filename to avoid conflicts
	const filename = `demo-${fileCounter++}.tsx`;
	return project.createSourceFile(filename, source, {
		scriptKind: ScriptKind.TSX,
		overwrite: true,
	});
}

// ============================================================================
// Main Transform Function
// ============================================================================

export function transformDemo(rawContent: string): TransformResult {
	const sourceFile = createSourceFile(rawContent);

	// Build full source (just path replacements)
	const source = transformPaths(rawContent).replace("export default function", "export function").trim();

	// Build preview
	const preview = buildPreview(sourceFile);

	// Cleanup
	project.removeSourceFile(sourceFile);

	return { source, preview };
}

// ============================================================================
// Preview Builder
// ============================================================================

function buildPreview(sourceFile: SourceFile): string {
	const parts: string[] = [];

	// 1. Get top-level declarations (outside function) as placeholders
	const topLevelDeclarations = getTopLevelDeclarations(sourceFile);
	if (topLevelDeclarations.length > 0) {
		parts.push(topLevelDeclarations.map((d) => d.placeholder).join("\n"));
	}

	// 2. Get the function body (everything inside, including local vars)
	const functionBody = getFunctionBody(sourceFile);
	if (functionBody) {
		if (parts.length > 0) parts.push(""); // Empty line separator
		parts.push(transformPaths(dedent(functionBody)));
	}

	return parts.join("\n");
}

// ============================================================================
// AST Extraction Helpers
// ============================================================================

/**
 * Get all top-level variable declarations (const/let/var outside functions)
 * Returns them as placeholder strings: const name = /** ... * /;
 */
function getTopLevelDeclarations(sourceFile: SourceFile): TopLevelDeclaration[] {
	const declarations: TopLevelDeclaration[] = [];

	for (const statement of sourceFile.getStatements()) {
		// Skip non-variable statements
		if (!Node.isVariableStatement(statement)) continue;

		// Skip exported variables (those are part of the component API)
		if (statement.hasExportKeyword()) continue;

		// Get all variable names from this statement
		for (const declaration of statement.getDeclarations()) {
			const name = declaration.getName();
			declarations.push({
				name,
				placeholder: `const ${name} = /* ... */;`,
			});
		}
	}

	return declarations;
}

/**
 * Get the body of the export default function (or export function)
 * Returns everything inside the return statement
 */
function getFunctionBody(sourceFile: SourceFile): string | null {
	const exportFn = findExportFunction(sourceFile);
	if (!exportFn) return null;

	// Get the return statement
	const returnStatement = exportFn.getFirstDescendantByKind(SyntaxKind.ReturnStatement);
	if (!returnStatement) return null;

	const expression = returnStatement.getExpression();
	if (!expression) return null;

	// Handle parenthesized expressions: return (...);
	if (Node.isParenthesizedExpression(expression)) {
		return expression.getExpression().getText();
	}

	return expression.getText();
}

/**
 * Find the export default function or export function
 */
function findExportFunction(sourceFile: SourceFile): FunctionDeclaration | undefined {
	// Try to find export default function
	const defaultExport = sourceFile.getFunction((fn) => fn.isDefaultExport());
	if (defaultExport) return defaultExport;

	// Try to find named export function
	return sourceFile.getFunction((fn) => fn.hasExportKeyword());
}

// ============================================================================
// String Transformation Helpers
// ============================================================================

/**
 * Transform import paths from @dotui/registry to user-facing paths
 */
function transformPaths(code: string): string {
	return code.replace(/@dotui\/registry\/ui\//g, "@/components/ui/").replace(/@dotui\/registry\//g, "@/");
}

/**
 * Remove common leading whitespace from code extracted by ts-morph.
 *
 * When ts-morph extracts JSX via getText(), the first line starts at column 0,
 * but subsequent lines retain their original source indentation.
 *
 * Example input:
 *   "<div>
 *         <Child />
 *       </div>"
 *
 * This function normalizes it to:
 *   "<div>
 *     <Child />
 *   </div>"
 */
function dedent(code: string): string {
	const lines = code.split("\n");

	if (lines.length <= 1) {
		return code;
	}

	// Find the minimum indentation from lines 2+ (ignoring empty lines)
	// Line 1 is already at column 0 from ts-morph extraction
	const minIndent = lines.slice(1).reduce((min, line) => {
		// Skip empty lines
		if (line.trim() === "") return min;

		const leadingWhitespace = line.match(/^(\s*)/);
		const indent = leadingWhitespace?.[1]?.length ?? 0;
		return Math.min(min, indent);
	}, Number.POSITIVE_INFINITY);

	if (minIndent === 0 || minIndent === Number.POSITIVE_INFINITY) {
		return code;
	}

	// Remove the base indentation from lines 2+
	// Then apply standard 2-space indentation for proper nesting
	return lines
		.map((line, index) => {
			if (index === 0) return line; // First line stays as-is
			if (line.trim() === "") return ""; // Empty lines stay empty
			return line.slice(minIndent);
		})
		.join("\n");
}
