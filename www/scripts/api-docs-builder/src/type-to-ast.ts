/**
 * TypeScript Type to AST Converter
 *
 * Converts TypeScript's type representations to our custom Type AST format
 * for rich type rendering with popovers and navigation.
 */

import ts from "typescript";

import type {
	TAlias,
	TApplication,
	TArray,
	TBooleanLiteral,
	TFunction,
	TIdentifier,
	TIndexedAccess,
	TInterface,
	TIntersection,
	TKeyof,
	TKeyword,
	TLink,
	TMethod,
	TNumberLiteral,
	TObject,
	TParameter,
	TProperty,
	TStringLiteral,
	TTemplate,
	TTuple,
	TType,
	TTypeParameter,
	TUnion,
	TypeLinksRegistry,
} from "@/modules/docs/api-reference/types/type-ast";

export interface ConversionContext {
	checker: ts.TypeChecker;
	links: TypeLinksRegistry;
	visited: Set<string>;
	maxDepth: number;
	currentDepth: number;
}

/**
 * Types that should preserve ALL their type arguments (not filter defaults).
 * These are typically render prop types where the type parameter is meaningful.
 */
const PRESERVE_ALL_TYPE_ARGS = new Set(["ChildrenOrFunction", "StyleOrFunction", "ClassNameOrFunction"]);

/**
 * Filter out trailing type arguments that equal their default values.
 * This produces cleaner output like `Iterable<Key>` instead of `Iterable<Key, any, any>`.
 *
 * @param typeArgs - The resolved type arguments from TypeScript
 * @param typeName - The name of the type (to check whitelist)
 * @param symbol - The type's symbol (to get type parameter declarations)
 * @param checker - The TypeScript type checker
 */
function filterDefaultTypeArgs(
	typeArgs: readonly ts.Type[],
	typeName: string,
	symbol: ts.Symbol | undefined,
	checker: ts.TypeChecker,
): ts.Type[] {
	// Preserve all args for whitelisted types
	if (PRESERVE_ALL_TYPE_ARGS.has(typeName)) {
		return [...typeArgs];
	}

	// Get the type parameter declarations to check defaults
	const declarations = symbol?.getDeclarations();
	const decl = declarations?.[0];

	let typeParamDecls: readonly ts.TypeParameterDeclaration[] | undefined;

	if (decl) {
		if (ts.isInterfaceDeclaration(decl) || ts.isClassDeclaration(decl)) {
			typeParamDecls = decl.typeParameters;
		} else if (ts.isTypeAliasDeclaration(decl)) {
			typeParamDecls = decl.typeParameters;
		}
	}

	// If we can't find type parameter declarations, return all args
	if (!typeParamDecls || typeParamDecls.length === 0) {
		return [...typeArgs];
	}

	// Filter out trailing arguments that match their defaults
	const result = [...typeArgs];

	// Work backwards, removing args that equal their defaults
	while (result.length > 0) {
		const lastIndex = result.length - 1;
		const lastArg = result[lastIndex];
		const paramDecl = typeParamDecls[lastIndex];

		// If there's no corresponding param declaration, keep the arg
		if (!paramDecl) break;

		// If the param has no default, we must keep this arg
		if (!paramDecl.default) break;

		// Get the default type
		const defaultType = checker.getTypeAtLocation(paramDecl.default);

		// Check if the argument equals the default by comparing type strings
		// This is a simple heuristic that works well for common cases like `any`, `undefined`
		const argString = checker.typeToString(lastArg!);
		const defaultString = checker.typeToString(defaultType);

		if (argString !== defaultString) {
			break; // Arg differs from default, stop filtering
		}

		// This arg equals its default, remove it
		result.pop();
	}

	return result;
}

/**
 * Parse a simple type name into an AST node
 * Handles primitives (string, number, boolean, etc.) and returns identifier for others
 */
export function parseSimpleType(typeName: string): TType {
	switch (typeName) {
		case "void":
			return { type: "void" } as TKeyword;
		case "string":
			return { type: "string" } as TKeyword;
		case "number":
			return { type: "number" } as TKeyword;
		case "boolean":
			return { type: "boolean" } as TKeyword;
		case "null":
			return { type: "null" } as TKeyword;
		case "undefined":
			return { type: "undefined" } as TKeyword;
		case "any":
			return { type: "any" } as TKeyword;
		case "unknown":
			return { type: "unknown" } as TKeyword;
		case "never":
			return { type: "never" } as TKeyword;
		case "object":
			return { type: "object" } as TKeyword;
		case "bigint":
			return { type: "bigint" } as TKeyword;
		case "symbol":
			return { type: "symbol" } as TKeyword;
		default:
			// For complex types, return as identifier
			return { type: "identifier", name: typeName } as TIdentifier;
	}
}

/**
 * Build a simplified AST directly from the type string
 * This preserves type aliases like ChildrenOrFunction<T> instead of expanding them
 */
export function buildTypeAstFromString(typeString: string, _context: ConversionContext): TType | null {
	// ============================================================================
	// Pattern: ChildrenOrFunction<T> → ReactNode | ((values: T) => ReactNode)
	// Also matches the expanded form: ReactNode | (values: T) => ReactNode
	// ============================================================================
	const childrenOrFunctionMatch = typeString.match(/^ChildrenOrFunction<(\w+(?:<[^>]+>)?)>$/);
	if (childrenOrFunctionMatch) {
		const renderPropsName = childrenOrFunctionMatch[1];
		return {
			type: "union",
			elements: [
				{ type: "identifier", name: "ReactNode" } as TIdentifier,
				{
					type: "function",
					parameters: [
						{
							type: "parameter",
							name: "values",
							value: {
								type: "link",
								id: renderPropsName,
								name: renderPropsName,
							} as TLink,
							optional: false,
							rest: false,
						} as TParameter,
					],
					return: { type: "identifier", name: "ReactNode" } as TIdentifier,
					typeParameters: [],
				} as TFunction,
			],
		} as TUnion;
	}

	// Expanded form: ReactNode | (values: T) => ReactNode
	const expandedChildrenMatch = typeString.match(/^ReactNode \| \(values: (\w+)\) => ReactNode$/);
	if (expandedChildrenMatch) {
		const renderPropsName = expandedChildrenMatch[1];
		return {
			type: "union",
			elements: [
				{ type: "identifier", name: "ReactNode" } as TIdentifier,
				{
					type: "function",
					parameters: [
						{
							type: "parameter",
							name: "values",
							value: {
								type: "link",
								id: renderPropsName,
								name: renderPropsName,
							} as TLink,
							optional: false,
							rest: false,
						} as TParameter,
					],
					return: { type: "identifier", name: "ReactNode" } as TIdentifier,
					typeParameters: [],
				} as TFunction,
			],
		} as TUnion;
	}

	// ============================================================================
	// Pattern: ClassNameOrFunction<T> → string | ((values: T) => string)
	// Also matches the expanded form: string | (values: T) => string
	// ============================================================================
	const classNameOrFunctionMatch = typeString.match(/^ClassNameOrFunction<(\w+(?:<[^>]+>)?)>$/);
	if (classNameOrFunctionMatch) {
		const renderPropsName = classNameOrFunctionMatch[1];
		return {
			type: "union",
			elements: [
				{ type: "string" } as TKeyword,
				{
					type: "function",
					parameters: [
						{
							type: "parameter",
							name: "values",
							value: {
								type: "link",
								id: renderPropsName,
								name: renderPropsName,
							} as TLink,
							optional: false,
							rest: false,
						} as TParameter,
					],
					return: { type: "string" } as TKeyword,
					typeParameters: [],
				} as TFunction,
			],
		} as TUnion;
	}

	// Expanded form: string | (values: T) => string
	const expandedClassNameMatch = typeString.match(/^string \| \(values: (\w+)\) => string$/);
	if (expandedClassNameMatch) {
		const renderPropsName = expandedClassNameMatch[1];
		return {
			type: "union",
			elements: [
				{ type: "string" } as TKeyword,
				{
					type: "function",
					parameters: [
						{
							type: "parameter",
							name: "values",
							value: {
								type: "link",
								id: renderPropsName,
								name: renderPropsName,
							} as TLink,
							optional: false,
							rest: false,
						} as TParameter,
					],
					return: { type: "string" } as TKeyword,
					typeParameters: [],
				} as TFunction,
			],
		} as TUnion;
	}

	// ============================================================================
	// Pattern: StyleOrFunction<T> → CSSProperties | ((values: T) => CSSProperties)
	// Also matches the expanded form: CSSProperties | (values: T) => CSSProperties
	// ============================================================================
	const styleOrFunctionMatch = typeString.match(/^StyleOrFunction<(\w+(?:<[^>]+>)?)>$/);
	if (styleOrFunctionMatch) {
		const renderPropsName = styleOrFunctionMatch[1];
		return {
			type: "union",
			elements: [
				{ type: "identifier", name: "CSSProperties" } as TIdentifier,
				{
					type: "function",
					parameters: [
						{
							type: "parameter",
							name: "values",
							value: {
								type: "link",
								id: renderPropsName,
								name: renderPropsName,
							} as TLink,
							optional: false,
							rest: false,
						} as TParameter,
					],
					return: { type: "identifier", name: "CSSProperties" } as TIdentifier,
					typeParameters: [],
				} as TFunction,
			],
		} as TUnion;
	}

	// Expanded form: CSSProperties | (values: T) => CSSProperties
	const expandedStyleMatch = typeString.match(/^CSSProperties \| \(values: (\w+)\) => CSSProperties$/);
	if (expandedStyleMatch) {
		const renderPropsName = expandedStyleMatch[1];
		return {
			type: "union",
			elements: [
				{ type: "identifier", name: "CSSProperties" } as TIdentifier,
				{
					type: "function",
					parameters: [
						{
							type: "parameter",
							name: "values",
							value: {
								type: "link",
								id: renderPropsName,
								name: renderPropsName,
							} as TLink,
							optional: false,
							rest: false,
						} as TParameter,
					],
					return: { type: "identifier", name: "CSSProperties" } as TIdentifier,
					typeParameters: [],
				} as TFunction,
			],
		} as TUnion;
	}

	// ============================================================================
	// Pattern: Simple primitives and identifiers (e.g., ReactNode, string, number)
	// ============================================================================
	const simpleType = parseSimpleType(typeString);
	if (simpleType.type !== "identifier") {
		return simpleType;
	}

	// ============================================================================
	// Pattern: String literal unions like "sm" | "md" | "lg"
	// ============================================================================
	if (/^"[^"]*"(\s*\|\s*"[^"]*")*$/.test(typeString)) {
		const literals = typeString.match(/"[^"]*"/g) || [];
		return {
			type: "union",
			elements: literals.map(
				(lit) =>
					({
						type: "stringLiteral",
						value: lit.slice(1, -1), // Remove quotes
					}) as TStringLiteral,
			),
		} as TUnion;
	}

	// ============================================================================
	// Pattern: Function types like ((e: PressEvent) => void)
	// ============================================================================
	const functionMatch = typeString.match(/^\(\((\w+):\s*(\w+)\)\s*=>\s*(\w+)\)$/);
	if (functionMatch?.[1] && functionMatch[2] && functionMatch[3]) {
		const paramName = functionMatch[1];
		const paramType = functionMatch[2];
		const returnType = functionMatch[3];
		return {
			type: "function",
			parameters: [
				{
					type: "parameter",
					name: paramName,
					value: { type: "link", id: paramType, name: paramType } as TLink,
					optional: false,
					rest: false,
				} as TParameter,
			],
			return: parseSimpleType(returnType),
			typeParameters: [],
		} as TFunction;
	}

	// No simplification available
	return null;
}

/**
 * Create a unique ID for a type
 */
function getTypeId(type: ts.Type, checker: ts.TypeChecker): string {
	const symbol = type.getSymbol() || type.aliasSymbol;
	if (symbol) {
		const declarations = symbol.getDeclarations();
		const decl = declarations?.[0];
		if (decl) {
			const sourceFile = decl.getSourceFile();
			return `${sourceFile.fileName}:${symbol.getName()}`;
		}
		return symbol.getName();
	}
	return checker.typeToString(type);
}

/**
 * Convert a TypeScript type to our AST format
 */
export function typeToAst(type: ts.Type, context: ConversionContext): TType | null {
	const { checker, maxDepth, currentDepth, visited, links } = context;

	// Prevent infinite recursion
	if (currentDepth > maxDepth) {
		return {
			type: "identifier",
			name: checker.typeToString(type),
		} as TIdentifier;
	}

	// ============================================================================
	// IMPORTANT: Check for type alias FIRST before TypeScript expands it!
	// This preserves type aliases like HTMLAttributeAnchorTarget, ReactNode, etc.
	// Similar to baseui-docs approach: if a type has an alias, use the alias name.
	// External types (from node_modules or .d.ts) are preserved as identifiers.
	// ============================================================================
	const aliasSymbol = type.aliasSymbol;
	if (aliasSymbol) {
		const aliasName = aliasSymbol.getName();

		// Preserve external/library types as identifiers (e.g., ReactNode, CSSProperties)
		// This prevents unnecessary expansion of well-known types.
		const declarations = aliasSymbol.getDeclarations();
		const isExternalType = declarations?.some((decl) => {
			const fileName = decl.getSourceFile().fileName;
			return fileName.includes("node_modules") || fileName.includes(".d.ts");
		});

		if (isExternalType) {
			const typeArgs = type.aliasTypeArguments;
			if (typeArgs && typeArgs.length > 0) {
				// Filter out trailing default type arguments for cleaner output
				const filteredArgs = filterDefaultTypeArgs(typeArgs, aliasName, aliasSymbol, checker);

				if (filteredArgs.length > 0) {
					const typeParams = filteredArgs
						.map((t) => typeToAst(t, { ...context, currentDepth: currentDepth + 1 }))
						.filter((t): t is TType => t !== null);

					return {
						type: "application",
						base: { type: "identifier", name: aliasName } as TIdentifier,
						typeParameters: typeParams,
					} as TApplication;
				}
			}
			return { type: "identifier", name: aliasName } as TIdentifier;
		}
	}

	// ============================================================================
	// Check the string representation for complex React types that we shouldn't expand
	// This catches cases where TypeScript has already expanded the alias
	// ============================================================================
	const typeString = checker.typeToString(type);
	const simplifiedType = buildTypeAstFromString(typeString, context);
	if (simplifiedType) {
		return simplifiedType;
	}

	const typeId = getTypeId(type, checker);

	// Handle flags-based types
	const flags = type.getFlags();

	// Keyword types
	if (flags & ts.TypeFlags.Any) return { type: "any" } as TKeyword;
	if (flags & ts.TypeFlags.Unknown) return { type: "unknown" } as TKeyword;
	if (flags & ts.TypeFlags.Void) return { type: "void" } as TKeyword;
	if (flags & ts.TypeFlags.Undefined) return { type: "undefined" } as TKeyword;
	if (flags & ts.TypeFlags.Null) return { type: "null" } as TKeyword;
	if (flags & ts.TypeFlags.Never) return { type: "never" } as TKeyword;
	if (flags & ts.TypeFlags.BigInt) return { type: "bigint" } as TKeyword;

	// Literal types
	if (flags & ts.TypeFlags.StringLiteral) {
		return {
			type: "stringLiteral",
			value: (type as ts.StringLiteralType).value,
		} as TStringLiteral;
	}

	if (flags & ts.TypeFlags.NumberLiteral) {
		return {
			type: "numberLiteral",
			value: (type as ts.NumberLiteralType).value,
		} as TNumberLiteral;
	}

	if (flags & ts.TypeFlags.BooleanLiteral) {
		// TypeScript represents true/false as intrinsic types
		// Use type checker to get the string representation
		const typeStr = checker.typeToString(type);
		return {
			type: "booleanLiteral",
			value: typeStr === "true",
		} as TBooleanLiteral;
	}

	// Non-literal primitives
	if (flags & ts.TypeFlags.String) return { type: "string" } as TKeyword;
	if (flags & ts.TypeFlags.Number) return { type: "number" } as TKeyword;
	if (flags & ts.TypeFlags.Boolean) return { type: "boolean" } as TKeyword;
	if (flags & ts.TypeFlags.ESSymbol) return { type: "symbol" } as TKeyword;

	// Union types
	if (type.isUnion()) {
		const elements = type.types
			.map((t) => typeToAst(t, { ...context, currentDepth: currentDepth + 1 }))
			.filter((t): t is TType => t !== null);

		// Collapse true | false back to boolean (TypeScript expands boolean to true | false in unions)
		const collapsedElements = collapseBooleanLiterals(elements);

		// Simplify single-element unions
		const firstElement = collapsedElements[0];
		if (collapsedElements.length === 1 && firstElement) return firstElement;

		return { type: "union", elements: collapsedElements } as TUnion;
	}

	// Intersection types
	if (type.isIntersection()) {
		const types = type.types
			.map((t) => typeToAst(t, { ...context, currentDepth: currentDepth + 1 }))
			.filter((t): t is TType => t !== null);

		const firstType = types[0];
		if (types.length === 1 && firstType) return firstType;

		return { type: "intersection", types } as TIntersection;
	}

	// Function/callable types
	const callSignatures = type.getCallSignatures();
	const firstCallSig = callSignatures[0];
	if (firstCallSig) {
		return functionSignatureToAst(firstCallSig, context);
	}

	// Array types
	if (checker.isArrayType(type)) {
		const typeArgs = (type as ts.TypeReference).typeArguments;
		const firstTypeArg = typeArgs?.[0];
		if (firstTypeArg) {
			const elementType = typeToAst(firstTypeArg, {
				...context,
				currentDepth: currentDepth + 1,
			});
			if (elementType) {
				return { type: "array", elementType } as TArray;
			}
		}
	}

	// Tuple types
	if (checker.isTupleType(type)) {
		const typeArgs = (type as ts.TypeReference).typeArguments || [];
		const elements = typeArgs
			.map((t) => typeToAst(t, { ...context, currentDepth: currentDepth + 1 }))
			.filter((t): t is TType => t !== null);
		return { type: "tuple", elements } as TTuple;
	}

	// Object types (interfaces, type literals, classes)
	if (flags & ts.TypeFlags.Object) {
		const objectFlags = (type as ts.ObjectType).objectFlags;
		const symbol = type.getSymbol() || type.aliasSymbol;
		const typeName = symbol?.getName();

		// Reference to a named type (interface, class, type alias)
		if (symbol && typeName && !typeName.startsWith("__") && typeName !== "__type") {
			// Check if this is a generic type application
			const typeArgs = (type as ts.TypeReference).typeArguments;

			// Common built-in types we want to show as identifiers
			const builtInTypes = [
				"ReactNode",
				"ReactElement",
				"CSSProperties",
				"Element",
				"Event",
				"FocusEvent",
				"KeyboardEvent",
				"MouseEvent",
				"PointerEvent",
				"TouchEvent",
				"DragEvent",
				"ClipboardEvent",
				"WheelEvent",
				"AnimationEvent",
				"TransitionEvent",
				"FormEvent",
				"ChangeEvent",
				"FocusableElement",
				"Key",
				"Ref",
				"RefObject",
				"MutableRefObject",
				"ComponentProps",
				"HTMLAttributes",
				"AriaAttributes",
			];

			if (builtInTypes.includes(typeName)) {
				if (typeArgs && typeArgs.length > 0) {
					// Filter out trailing default type arguments for cleaner output
					const filteredArgs = filterDefaultTypeArgs(typeArgs, typeName, symbol, checker);

					if (filteredArgs.length > 0) {
						const typeParams = filteredArgs
							.map((t) => typeToAst(t, { ...context, currentDepth: currentDepth + 1 }))
							.filter((t): t is TType => t !== null);

						return {
							type: "application",
							base: { type: "identifier", name: typeName } as TIdentifier,
							typeParameters: typeParams,
						} as TApplication;
					}
				}
				return { type: "identifier", name: typeName } as TIdentifier;
			}

			// For custom types, create a link if we haven't seen it yet
			if (!visited.has(typeId) && currentDepth < maxDepth - 1) {
				// Mark as visited to prevent circular references
				visited.add(typeId);

				// Try to resolve the full type for the links registry
				const fullType = resolveNamedType(type, symbol, context);
				if (fullType) {
					links[typeId] = fullType;
				}
			}

			// Return a link to the type
			const link: TLink = {
				type: "link",
				id: typeId,
				name: cleanTypeName(typeName),
			};

			// If it has type arguments, wrap in application
			if (typeArgs && typeArgs.length > 0) {
				// Filter out trailing default type arguments for cleaner output
				const filteredArgs = filterDefaultTypeArgs(typeArgs, typeName, symbol, checker);

				if (filteredArgs.length > 0) {
					const typeParams = filteredArgs
						.map((t) => typeToAst(t, { ...context, currentDepth: currentDepth + 1 }))
						.filter((t): t is TType => t !== null);

					return {
						type: "application",
						base: link,
						typeParameters: typeParams,
					} as TApplication;
				}
			}

			return link;
		}

		// Anonymous object type (type literal)
		if (objectFlags & ts.ObjectFlags.Anonymous) {
			const properties = type.getProperties();
			if (properties.length > 0) {
				return objectTypeToAst(type, properties, context);
			}
		}

		// Mapped type
		if (objectFlags & ts.ObjectFlags.Mapped) {
			// For mapped types, just return a simplified representation
			return {
				type: "identifier",
				name: checker.typeToString(type),
			} as TIdentifier;
		}
	}

	// Conditional types
	if (flags & ts.TypeFlags.Conditional) {
		// For conditional types, just show as identifier since they're complex
		return {
			type: "identifier",
			name: checker.typeToString(type),
		} as TIdentifier;
	}

	// Index type (keyof T)
	if (flags & ts.TypeFlags.Index) {
		const indexType = type as ts.IndexType;
		return {
			type: "keyof",
			keyof:
				typeToAst(indexType.type, {
					...context,
					currentDepth: currentDepth + 1,
				}) || ({ type: "unknown" } as TKeyword),
		} as TKeyof;
	}

	// Indexed access type (T[K])
	if (flags & ts.TypeFlags.IndexedAccess) {
		const indexed = type as ts.IndexedAccessType;
		return {
			type: "indexedAccess",
			objectType:
				typeToAst(indexed.objectType, {
					...context,
					currentDepth: currentDepth + 1,
				}) || ({ type: "unknown" } as TKeyword),
			indexType:
				typeToAst(indexed.indexType, {
					...context,
					currentDepth: currentDepth + 1,
				}) || ({ type: "unknown" } as TKeyword),
		} as TIndexedAccess;
	}

	// Template literal types
	if (flags & ts.TypeFlags.TemplateLiteral) {
		const template = type as ts.TemplateLiteralType;
		const elements: TType[] = [];

		template.texts.forEach((text, i) => {
			if (text) {
				elements.push({ type: "stringLiteral", value: text } as TStringLiteral);
			}
			const templateType = template.types[i];
			if (i < template.types.length && templateType) {
				const t = typeToAst(templateType, {
					...context,
					currentDepth: currentDepth + 1,
				});
				if (t) elements.push(t);
			}
		});

		return { type: "template", elements } as TTemplate;
	}

	// Type parameter
	if (flags & ts.TypeFlags.TypeParameter) {
		const typeParam = type as ts.TypeParameter;
		const symbol = typeParam.getSymbol();
		return {
			type: "typeParameter",
			name: symbol?.getName() || "T",
			constraint: typeParam.getConstraint()
				? typeToAst(typeParam.getConstraint()!, {
						...context,
						currentDepth: currentDepth + 1,
					})
				: null,
			default: typeParam.getDefault()
				? typeToAst(typeParam.getDefault()!, {
						...context,
						currentDepth: currentDepth + 1,
					})
				: null,
		} as TTypeParameter;
	}

	// Fallback: return as identifier with string representation
	return {
		type: "identifier",
		name: cleanTypeName(checker.typeToString(type)),
	} as TIdentifier;
}

/**
 * Convert a function signature to AST
 */
function functionSignatureToAst(signature: ts.Signature, context: ConversionContext): TFunction {
	const { checker, currentDepth } = context;

	const parameters: TParameter[] = signature.parameters.map((param) => {
		const paramType = checker.getTypeOfSymbol(param);
		const declaration = param.valueDeclaration as ts.ParameterDeclaration;

		return {
			type: "parameter",
			name: param.getName(),
			value: typeToAst(paramType, { ...context, currentDepth: currentDepth + 1 }) || ({ type: "unknown" } as TKeyword),
			optional: declaration ? checker.isOptionalParameter(declaration) : false,
			rest: declaration ? !!declaration.dotDotDotToken : false,
		} as TParameter;
	});

	const returnType = checker.getReturnTypeOfSignature(signature);

	const typeParams = signature.typeParameters || [];
	const typeParameters: TTypeParameter[] = typeParams.map((tp) => ({
		type: "typeParameter",
		name: tp.getSymbol()?.getName() || "T",
		constraint: tp.getConstraint()
			? typeToAst(tp.getConstraint()!, {
					...context,
					currentDepth: currentDepth + 1,
				})
			: null,
		default: tp.getDefault()
			? typeToAst(tp.getDefault()!, {
					...context,
					currentDepth: currentDepth + 1,
				})
			: null,
	}));

	return {
		type: "function",
		parameters,
		return: typeToAst(returnType, { ...context, currentDepth: currentDepth + 1 }) || ({ type: "void" } as TKeyword),
		typeParameters,
	};
}

/**
 * Convert an object type to AST
 */
function objectTypeToAst(_type: ts.Type, properties: ts.Symbol[], context: ConversionContext): TObject {
	const { checker, currentDepth } = context;

	const propsRecord: Record<string, TProperty | TMethod> = {};

	for (const prop of properties) {
		const propType = checker.getTypeOfSymbol(prop);
		const declaration = prop.valueDeclaration;

		// Check if it's a method
		const callSignatures = propType.getCallSignatures();
		const firstSig = callSignatures[0];
		if (firstSig && !propType.getProperties().length) {
			propsRecord[prop.getName()] = {
				type: "method",
				name: prop.getName(),
				value: functionSignatureToAst(firstSig, context),
				optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
				description: ts.displayPartsToString(prop.getDocumentationComment(checker)),
			} as TMethod;
		} else {
			propsRecord[prop.getName()] = {
				type: "property",
				name: prop.getName(),
				value:
					typeToAst(propType, {
						...context,
						currentDepth: currentDepth + 1,
					}) || ({ type: "unknown" } as TKeyword),
				optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
				readonly:
					declaration && ts.isPropertySignature(declaration)
						? !!declaration.modifiers?.some((m) => m.kind === ts.SyntaxKind.ReadonlyKeyword)
						: false,
				description: ts.displayPartsToString(prop.getDocumentationComment(checker)),
			} as TProperty;
		}
	}

	return { type: "objectLiteral", properties: propsRecord };
}

/**
 * Resolve a named type (interface, type alias, class) for the links registry
 */
function resolveNamedType(type: ts.Type, symbol: ts.Symbol, context: ConversionContext): TType | null {
	const { checker, currentDepth } = context;
	const declarations = symbol.getDeclarations();
	const decl = declarations?.[0];
	if (!decl) return null;

	const name = symbol.getName();
	const description = ts.displayPartsToString(symbol.getDocumentationComment(checker));

	// Interface
	if (ts.isInterfaceDeclaration(decl)) {
		const properties = type.getProperties();
		const propsRecord: Record<string, TProperty | TMethod> = {};

		for (const prop of properties) {
			const propType = checker.getTypeOfSymbol(prop);
			const callSignatures = propType.getCallSignatures();
			const firstCallSig = callSignatures[0];

			if (firstCallSig && !propType.getProperties().length) {
				propsRecord[prop.getName()] = {
					type: "method",
					name: prop.getName(),
					value: functionSignatureToAst(firstCallSig, context),
					optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
					description: ts.displayPartsToString(prop.getDocumentationComment(checker)),
				} as TMethod;
			} else {
				propsRecord[prop.getName()] = {
					type: "property",
					name: prop.getName(),
					value:
						typeToAst(propType, {
							...context,
							currentDepth: currentDepth + 1,
						}) || ({ type: "unknown" } as TKeyword),
					optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
					readonly: false,
					description: ts.displayPartsToString(prop.getDocumentationComment(checker)),
				} as TProperty;
			}
		}

		// Get extends clauses
		const extendsTypes: TType[] = [];
		if (decl.heritageClauses) {
			for (const clause of decl.heritageClauses) {
				if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
					for (const expr of clause.types) {
						const exprType = checker.getTypeAtLocation(expr);
						const t = typeToAst(exprType, {
							...context,
							currentDepth: currentDepth + 1,
						});
						if (t) extendsTypes.push(t);
					}
				}
			}
		}

		return {
			type: "interface",
			id: getTypeId(type, checker),
			name: cleanTypeName(name),
			extends: extendsTypes,
			properties: propsRecord,
			typeParameters: [],
			description,
		} as TInterface;
	}

	// Type alias
	if (ts.isTypeAliasDeclaration(decl)) {
		const aliasedType = checker.getTypeAtLocation(decl.type);
		return {
			type: "alias",
			id: getTypeId(type, checker),
			name: cleanTypeName(name),
			value:
				typeToAst(aliasedType, {
					...context,
					currentDepth: currentDepth + 1,
				}) || ({ type: "unknown" } as TKeyword),
			typeParameters: [],
			description,
		} as TAlias;
	}

	return null;
}

/**
 * Clean up type names by removing module prefixes
 */
function cleanTypeName(name: string): string {
	return name
		.replace(/^React\./, "")
		.replace(/^import\([^)]+\)\./, "")
		.replace(/^typeof\s+/, "");
}

/**
 * Create initial conversion context
 */
export function createConversionContext(checker: ts.TypeChecker, maxDepth = 5): ConversionContext {
	return {
		checker,
		links: {},
		visited: new Set(),
		maxDepth,
		currentDepth: 0,
	};
}

/**
 * Collapse true | false back to boolean in union types
 * TypeScript internally represents boolean as true | false, so when iterating
 * through union members, we get the expanded form. This collapses them back.
 */
function collapseBooleanLiterals(elements: TType[]): TType[] {
	const hasTrue = elements.some((e) => e.type === "booleanLiteral" && e.value === true);
	const hasFalse = elements.some((e) => e.type === "booleanLiteral" && e.value === false);

	if (hasTrue && hasFalse) {
		// Remove both true and false, add boolean keyword
		return [{ type: "boolean" } as TKeyword, ...elements.filter((e) => e.type !== "booleanLiteral")];
	}

	return elements;
}
