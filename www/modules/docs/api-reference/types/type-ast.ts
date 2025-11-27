/**
 * Type AST - A structured representation of TypeScript types
 * Based on s2-docs implementation for rich type rendering with popovers
 */

// Keyword types (primitives and special types)
export interface TKeyword {
  type:
    | "any"
    | "null"
    | "undefined"
    | "void"
    | "unknown"
    | "never"
    | "this"
    | "symbol"
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "bigint";
}

// Identifier (a named type reference without full resolution)
export interface TIdentifier {
  type: "identifier";
  name: string;
}

// Literal types
export interface TStringLiteral {
  type: "stringLiteral";
  value: string;
}

export interface TNumberLiteral {
  type: "numberLiteral";
  value: number;
}

export interface TBooleanLiteral {
  type: "booleanLiteral";
  value: boolean;
}

// Union type (A | B | C)
export interface TUnion {
  type: "union";
  elements: TType[];
}

// Intersection type (A & B)
export interface TIntersection {
  type: "intersection";
  types: TType[];
}

// Generic type application (Array<T>, Promise<T>)
export interface TApplication {
  type: "application";
  base: TType;
  typeParameters: TType[];
}

// Type operator (keyof, typeof, readonly)
export interface TTypeOperator {
  type: "typeOperator";
  operator: string;
  value: TType;
}

// Function parameter
export interface TParameter {
  type: "parameter";
  name: string;
  value: TType;
  optional: boolean;
  rest: boolean;
  description?: string;
  default?: string;
}

// Function type
export interface TFunction {
  type: "function";
  id?: string;
  name?: string;
  parameters: TParameter[];
  return: TType;
  typeParameters: TTypeParameter[];
  description?: string;
}

// Type parameter (T extends Foo = Bar)
export interface TTypeParameter {
  type: "typeParameter";
  name: string;
  constraint: TType | null;
  default: TType | null;
}

// Object property
export interface TProperty {
  type: "property";
  name: string;
  value: TType;
  optional: boolean;
  readonly: boolean;
  description?: string;
  default?: string;
}

// Method in an object/interface
export interface TMethod {
  type: "method";
  name: string;
  value: TFunction;
  optional: boolean;
  description?: string;
}

// Interface type
export interface TInterface {
  type: "interface";
  id: string;
  name: string;
  extends: TType[];
  properties: Record<string, TProperty | TMethod>;
  typeParameters: TTypeParameter[];
  description?: string;
}

// Type alias
export interface TAlias {
  type: "alias";
  id: string;
  name: string;
  value: TType;
  typeParameters: TTypeParameter[];
  description?: string;
}

// Object literal type
export interface TObject {
  type: "object";
  properties: Record<string, TProperty | TMethod> | null;
}

// Array type
export interface TArray {
  type: "array";
  elementType: TType;
}

// Tuple type
export interface TTuple {
  type: "tuple";
  elements: TType[];
}

// Template literal type
export interface TTemplate {
  type: "template";
  elements: TType[];
}

// Conditional type (A extends B ? C : D)
export interface TConditional {
  type: "conditional";
  checkType: TType;
  extendsType: TType;
  trueType: TType;
  falseType: TType;
}

// Indexed access type (T[K])
export interface TIndexedAccess {
  type: "indexedAccess";
  objectType: TType;
  indexType: TType;
}

// Keyof type
export interface TKeyof {
  type: "keyof";
  keyof: TType;
}

// Link to another type (for navigation)
export interface TLink {
  type: "link";
  id: string;
  name: string;
}

// Mapped type
export interface TMapped {
  type: "mapped";
  readonly: boolean | "+" | "-";
  typeParameter: TTypeParameter;
  typeAnnotation: TType;
}

// Parenthesized type (for display purposes)
export interface TParenthesized {
  type: "parenthesized";
  value: TType;
}

// All type nodes
export type TType =
  | TKeyword
  | TIdentifier
  | TStringLiteral
  | TNumberLiteral
  | TBooleanLiteral
  | TUnion
  | TIntersection
  | TApplication
  | TTypeOperator
  | TFunction
  | TParameter
  | TMethod
  | TAlias
  | TInterface
  | TObject
  | TProperty
  | TArray
  | TTuple
  | TTemplate
  | TTypeParameter
  | TConditional
  | TIndexedAccess
  | TKeyof
  | TLink
  | TMapped
  | TParenthesized;

/**
 * Type links registry - maps type IDs to their full definitions
 * This allows TypeLink components to look up and display type details
 */
export type TypeLinksRegistry = Record<string, TType>;

