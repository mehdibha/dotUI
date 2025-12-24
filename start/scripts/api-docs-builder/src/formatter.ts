import { uniq } from "es-toolkit/array";
import * as prettier from "prettier";
import * as tae from "typescript-api-extractor";

/**
 * Extract properties from various type structures
 */
export function getPropertiesFromType(type: tae.AnyType): tae.PropertyNode[] {
	if (type instanceof tae.ComponentNode) {
		return type.props;
	}

	if (type instanceof tae.ObjectNode) {
		return type.properties;
	}

	if (type instanceof tae.IntersectionNode) {
		// Merge properties from all intersection members
		const allProps: tae.PropertyNode[] = [];
		for (const member of type.types) {
			allProps.push(...getPropertiesFromType(member));
		}
		return allProps;
	}

	return [];
}

export async function formatProperties(
	props: tae.PropertyNode[],
	allExports: tae.ExportNode[] | undefined = undefined,
) {
	const result: Record<string, unknown> = {};

	for (const prop of props) {
		// Skip `ref` for components
		if (prop.name === "ref") {
			continue;
		}

		// Only include props with JSDoc documentation
		// This excludes DOM attributes (no docs) but includes React Aria props (have docs)
		if (!prop.documentation?.description) {
			continue;
		}

		const exampleTag = prop.documentation?.tags
			?.filter((tag) => tag.name === "example")
			.map((tag) => tag.value)
			.join("\n");

		let detailedType = formatType(prop.type, prop.optional, prop.documentation?.tags);

		// For most props, expand the detailed type
		if (prop.name !== "className" && prop.name !== "render" && allExports) {
			detailedType = formatDetailedType(prop.type, allExports);
		}

		// Format with Prettier to get nice line breaks for long types
		detailedType = await formatTypeWithPrettier(detailedType);

		const formattedType = formatType(prop.type, prop.optional, prop.documentation?.tags);

		const resultObject: Record<string, unknown> = {
			type: formattedType,
			default: prop.documentation?.defaultValue,
			required: !prop.optional || undefined,
			description: prop.documentation?.description,
			example: exampleTag || undefined,
			detailedType,
		};

		// Remove detailedType if it's the same as type
		if (detailedType === formattedType) {
			delete resultObject.detailedType;
		}

		// Remove undefined values
		Object.keys(resultObject).forEach((key) => {
			if (resultObject[key] === undefined) {
				delete resultObject[key];
			}
		});

		result[prop.name] = resultObject;
	}

	return result;
}

/**
 * Format a type string with Prettier for better readability.
 * Long union types will be split across multiple lines.
 */
async function formatTypeWithPrettier(type: string): Promise<string> {
	try {
		const formatted = await prettier.format(`type _ = ${type}`, {
			parser: "typescript",
			singleQuote: true,
			semi: false,
			printWidth: 60,
		});

		// Prettier either formats on a single line or multiple lines.
		// If single line, remove the `type _ = ` prefix.
		// If multiple lines, remove the first line and de-indent the rest.
		const lines = formatted.trimEnd().split("\n");
		if (lines.length === 1) {
			return lines[0].replace(/^type _ = /, "");
		}

		// Multi-line: skip first line (`type _ =`) and de-indent
		const codeLines = lines.slice(1);
		const nonEmptyLines = codeLines.filter((l) => l.trim() !== "");
		if (nonEmptyLines.length > 0) {
			const minIndent = Math.min(...nonEmptyLines.map((l) => l.match(/^\s*/)?.[0].length ?? 0));
			if (Number.isFinite(minIndent) && minIndent > 0) {
				return codeLines.map((l) => l.substring(minIndent)).join("\n");
			}
		}
		return codeLines.join("\n");
	} catch {
		// If Prettier fails, return the original type
		return type;
	}
}

export function formatDetailedType(
	type: tae.AnyType,
	allExports: tae.ExportNode[],
	visited = new Set<string>(),
): string {
	// Prevent infinite recursion
	if (type instanceof tae.ExternalTypeNode) {
		const qualifiedName = getFullyQualifiedName(type.typeName);
		if (visited.has(qualifiedName)) {
			return qualifiedName;
		}
		visited.add(qualifiedName);

		const exportNode = allExports.find((node) => node.name === type.typeName.name);
		if (exportNode) {
			return formatDetailedType((exportNode.type as unknown as tae.AnyType) ?? type, allExports, visited);
		}

		return qualifiedName;
	}

	if (type instanceof tae.UnionNode) {
		const memberTypes = type.types.map((t) => formatDetailedType(t, allExports, visited));
		return uniq(memberTypes).join(" | ");
	}

	if (type instanceof tae.IntersectionNode) {
		const memberTypes = type.types.map((t) => formatDetailedType(t, allExports, visited));
		return uniq(memberTypes).join(" & ");
	}

	// For objects and everything else, reuse existing formatter with object expansion enabled
	return formatType(type, false, undefined, true);
}

export function formatType(
	type: tae.AnyType,
	removeUndefined: boolean,
	jsdocTags: tae.DocumentationTag[] | undefined = undefined,
	expandObjects = false,
): string {
	const typeTag = jsdocTags?.find?.((tag) => tag.name === "type");
	const typeValue = typeTag?.value;

	if (typeValue) {
		return typeValue;
	}

	if (type instanceof tae.ExternalTypeNode) {
		if (/^ReactElement(<.*>)?/.test(type.typeName.name || "")) {
			return "ReactElement";
		}

		if (type.typeName.namespaces?.length === 1 && type.typeName.namespaces[0] === "React") {
			return createNameWithTypeArguments(type.typeName);
		}

		return getFullyQualifiedName(type.typeName);
	}

	if (type instanceof tae.IntrinsicNode) {
		return type.typeName ? getFullyQualifiedName(type.typeName) : type.intrinsic;
	}

	if (type instanceof tae.UnionNode) {
		if (type.typeName) {
			return getFullyQualifiedName(type.typeName);
		}

		let memberTypes = type.types;

		if (removeUndefined) {
			memberTypes = memberTypes.filter((t) => !(t instanceof tae.IntrinsicNode && t.intrinsic === "undefined"));
		}

		// Flatten nested unions
		const flattenedMemberTypes = memberTypes.flatMap((t) => {
			if (t instanceof tae.UnionNode) {
				return t.typeName ? t : t.types;
			}

			if (t instanceof tae.TypeParameterNode && t.constraint instanceof tae.UnionNode) {
				return t.constraint.types;
			}

			return t;
		});

		const formattedMemberTypes = uniq(orderMembers(flattenedMemberTypes).map((t) => formatType(t, removeUndefined)));

		return formattedMemberTypes.join(" | ");
	}

	if (type instanceof tae.IntersectionNode) {
		if (type.typeName) {
			return getFullyQualifiedName(type.typeName);
		}

		return orderMembers(type.types)
			.map((t) => formatType(t, false))
			.join(" & ");
	}

	if (type instanceof tae.ObjectNode) {
		if (type.typeName && !expandObjects) {
			return getFullyQualifiedName(type.typeName);
		}

		if (isObjectEmpty(type.properties)) {
			return "{}";
		}

		return `{ ${type.properties
			.map((m) => `${m.name}${m.optional ? "?" : ""}: ${formatType(m.type, m.optional)}`)
			.join(", ")} }`;
	}

	if (type instanceof tae.LiteralNode) {
		return normalizeQuotes(type.value as string);
	}

	if (type instanceof tae.ArrayNode) {
		const formattedMemberType = formatType(type.elementType, false);

		if (formattedMemberType.includes(" ")) {
			return `(${formattedMemberType})[]`;
		}

		return `${formattedMemberType}[]`;
	}

	if (type instanceof tae.FunctionNode) {
		// If object expansion is requested, expand the function signature
		if (!expandObjects && type.typeName && !type.typeName.name?.startsWith("ComponentRenderFn")) {
			return getFullyQualifiedName(type.typeName);
		}

		const functionSignature = type.callSignatures
			.map((s) => {
				const params = s.parameters.map((p) => `${p.name}: ${formatType(p.type, false)}`).join(", ");
				const returnType = formatType(s.returnValueType, false);
				return `(${params}) => ${returnType}`;
			})
			.join(" | ");
		return `(${functionSignature})`;
	}

	if (type instanceof tae.TupleNode) {
		if (type.typeName) {
			return getFullyQualifiedName(type.typeName);
		}

		return `[${type.types.map((member: tae.AnyType) => formatType(member, false)).join(", ")}]`;
	}

	if (type instanceof tae.TypeParameterNode) {
		return type.constraint !== undefined ? formatType(type.constraint, removeUndefined) : type.name;
	}

	return "unknown";
}

function getFullyQualifiedName(typeName: tae.TypeName): string {
	const nameWithTypeArgs = createNameWithTypeArguments(typeName);

	if (!typeName.namespaces || typeName.namespaces.length === 0) {
		return nameWithTypeArgs;
	}

	return `${typeName.namespaces.join(".")}.${nameWithTypeArgs}`;
}

function createNameWithTypeArguments(typeName: tae.TypeName) {
	if (
		typeName.typeArguments &&
		typeName.typeArguments.length > 0 &&
		typeName.typeArguments.some((ta) => ta.equalToDefault === false)
	) {
		return `${typeName.name}<${typeName.typeArguments.map((ta) => formatType(ta.type, false)).join(", ")}>`;
	}

	return typeName.name;
}

/**
 * Looks for 'any', 'null' and 'undefined' types and moves them to the end of the array of types.
 */
function orderMembers(members: readonly tae.AnyType[]): readonly tae.AnyType[] {
	let orderedMembers = pushToEnd(members, "any");
	orderedMembers = pushToEnd(orderedMembers, "null");
	orderedMembers = pushToEnd(orderedMembers, "undefined");
	return orderedMembers;
}

function pushToEnd(members: readonly tae.AnyType[], name: string): readonly tae.AnyType[] {
	const index = members.findIndex((member: tae.AnyType) => {
		return member instanceof tae.IntrinsicNode && member.intrinsic === name;
	});

	if (index !== -1) {
		const member = members[index];
		if (member) {
			return [...members.slice(0, index), ...members.slice(index + 1), member];
		}
	}

	return members;
}

function isObjectEmpty(object: tae.PropertyNode[]) {
	return object.length === 0;
}

function normalizeQuotes(str: string) {
	if (str.startsWith('"') && str.endsWith('"')) {
		return str
			.replaceAll("'", "\\'")
			.replaceAll('\\"', '"')
			.replace(/^"(.*)"$/, "'$1'");
	}

	return str;
}
