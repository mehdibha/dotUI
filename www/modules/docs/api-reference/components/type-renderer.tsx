"use client";

/**
 * Type Renderer - Recursively renders TypeScript type AST nodes
 * Inspired by s2-docs implementation
 */

import * as React from "react";

import { cn } from "@dotui/registry/lib/utils";

import type {
  TAlias,
  TApplication,
  TArray,
  TBooleanLiteral,
  TConditional,
  TFunction,
  TIdentifier,
  TIndexedAccess,
  TInterface,
  TKeyof,
  TKeyword,
  TLink,
  TMethod,
  TNumberLiteral,
  TObject,
  TParameter,
  TParenthesized,
  TProperty,
  TStringLiteral,
  TTemplate,
  TTuple,
  TType,
  TTypeOperator,
  TTypeParameter,
  TUnion,
  TypeLinksRegistry,
} from "../types/type-ast";
import { TypeLink } from "./type-popover";

/* -----------------------------------------------------------------------------------------------
 * Styles
 * ---------------------------------------------------------------------------------------------*/

const styles = {
  keyword: "text-[#0000ff] dark:text-[#569cd6]",
  string: "text-[#a31515] dark:text-[#ce9178]",
  number: "text-[#098658] dark:text-[#b5cea8]",
  function: "text-[#795e26] dark:text-[#dcdcaa]",
  variable: "text-[#001080] dark:text-[#9cdcfe]",
  attribute: "text-[#e50000] dark:text-[#9cdcfe]",
  punctuation: "text-fg-muted",
};

/* -----------------------------------------------------------------------------------------------
 * Context for type links
 * ---------------------------------------------------------------------------------------------*/

interface TypeRendererContextValue {
  links: TypeLinksRegistry;
}

const TypeRendererContext = React.createContext<TypeRendererContextValue>({
  links: {},
});

export function TypeRendererProvider({
  links,
  children,
}: {
  links: TypeLinksRegistry;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => ({ links }), [links]);
  return (
    <TypeRendererContext.Provider value={value}>
      {children}
    </TypeRendererContext.Provider>
  );
}

export function useTypeLinks() {
  return React.useContext(TypeRendererContext);
}

/* -----------------------------------------------------------------------------------------------
 * Main Type component
 * ---------------------------------------------------------------------------------------------*/

interface TypeProps {
  type: TType | null | undefined;
  className?: string;
}

export function Type({ type, className }: TypeProps) {
  if (!type) return null;

  const content = renderType(type);
  if (!content) return null;

  return (
    <code
      className={cn(
        "font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap",
        className,
      )}
    >
      {content}
    </code>
  );
}

function renderType(type: TType): React.ReactNode {
  switch (type.type) {
    // Keywords
    case "any":
    case "null":
    case "undefined":
    case "void":
    case "unknown":
    case "never":
    case "this":
    case "symbol":
    case "string":
    case "number":
    case "boolean":
    case "object":
    case "bigint":
      return <Keyword type={type.type} />;

    // Literals
    case "stringLiteral":
      return <StringLiteral value={type.value} />;
    case "numberLiteral":
      return <NumberLiteral value={type.value} />;
    case "booleanLiteral":
      return <BooleanLiteral value={type.value} />;

    // Identifier
    case "identifier":
      return <Identifier name={type.name} />;

    // Complex types
    case "union":
      return <UnionType elements={type.elements} />;
    case "intersection":
      return <IntersectionType types={type.types} />;
    case "application":
      return (
        <ApplicationType
          base={type.base}
          typeParameters={type.typeParameters}
        />
      );
    case "typeOperator":
      return <TypeOperatorType operator={type.operator} value={type.value} />;
    case "function":
      return (
        <FunctionType
          parameters={type.parameters}
          returnType={type.return}
          typeParameters={type.typeParameters}
          name={type.name}
        />
      );
    case "parameter":
      return <ParameterType param={type} />;
    case "link":
      return <LinkType id={type.id} name={type.name} />;
    case "interface":
      return <InterfaceTypeView iface={type} />;
    case "alias":
      return <AliasType alias={type} />;
    case "object":
      return <ObjectType properties={type.properties} />;
    case "property":
      return <PropertyType prop={type} />;
    case "method":
      return <MethodType method={type} />;
    case "array":
      return <ArrayType elementType={type.elementType} />;
    case "tuple":
      return <TupleType elements={type.elements} />;
    case "typeParameter":
      return <TypeParameterType param={type} />;
    case "conditional":
      return <ConditionalType conditional={type} />;
    case "indexedAccess":
      return (
        <IndexedAccessType
          objectType={type.objectType}
          indexType={type.indexType}
        />
      );
    case "keyof":
      return <KeyofType keyof={type.keyof} />;
    case "template":
      return <TemplateType elements={type.elements} />;
    case "mapped":
      return (
        <MappedType
          typeParameter={type.typeParameter}
          typeAnnotation={type.typeAnnotation}
        />
      );
    case "parenthesized":
      return <ParenthesizedType value={type.value} />;
    default:
      return null;
  }
}

/* -----------------------------------------------------------------------------------------------
 * Keyword types
 * ---------------------------------------------------------------------------------------------*/

function Keyword({ type }: { type: string }) {
  return <span className={styles.keyword}>{type}</span>;
}

/* -----------------------------------------------------------------------------------------------
 * Literal types
 * ---------------------------------------------------------------------------------------------*/

function StringLiteral({ value }: { value: string }) {
  const escaped = value.replace(/'/g, "\\'");
  return <span className={styles.string}>'{escaped}'</span>;
}

function NumberLiteral({ value }: { value: number }) {
  return <span className={styles.number}>{value}</span>;
}

function BooleanLiteral({ value }: { value: boolean }) {
  return <span className={styles.keyword}>{String(value)}</span>;
}

/* -----------------------------------------------------------------------------------------------
 * Identifier
 * ---------------------------------------------------------------------------------------------*/

const DOC_LINKS: Record<string, string> = {
  ReactNode: "https://react.dev/reference/react/ReactNode",
  ReactElement: "https://react.dev/reference/react/ReactElement",
  CSSProperties: "https://react.dev/docs/dom-elements#style",
  Key: "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
  Ref: "https://react.dev/reference/react/useRef",
  RefObject: "https://react.dev/reference/react/useRef",
  Element: "https://developer.mozilla.org/en-US/docs/Web/API/Element",
  FocusEvent:
    "https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent",
  KeyboardEvent:
    "https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent",
  MouseEvent:
    "https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent",
  PointerEvent:
    "https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent",
};

function Identifier({ name }: { name: string }) {
  const link = DOC_LINKS[name];

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(styles.variable, "underline decoration-dotted hover:decoration-solid")}
      >
        {name}
      </a>
    );
  }

  return <span className={styles.variable}>{name}</span>;
}

/* -----------------------------------------------------------------------------------------------
 * Union type
 * ---------------------------------------------------------------------------------------------*/

function UnionType({ elements }: { elements: TType[] }) {
  const shouldWrap = elements.length > 3;

  return (
    <>
      {elements.map((el, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className={styles.punctuation}>
              {shouldWrap ? "\n  | " : " | "}
            </span>
          )}
          {renderType(el)}
        </React.Fragment>
      ))}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Intersection type
 * ---------------------------------------------------------------------------------------------*/

function IntersectionType({ types }: { types: TType[] }) {
  return (
    <>
      {types.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.punctuation}> & </span>}
          {renderType(t)}
        </React.Fragment>
      ))}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Application type (generics)
 * ---------------------------------------------------------------------------------------------*/

function ApplicationType({
  base,
  typeParameters,
}: {
  base: TType;
  typeParameters: TType[];
}) {
  return (
    <>
      {renderType(base)}
      {typeParameters.length > 0 && (
        <>
          <span className={styles.punctuation}>&lt;</span>
          {typeParameters.map((tp, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className={styles.punctuation}>, </span>}
              {renderType(tp)}
            </React.Fragment>
          ))}
          <span className={styles.punctuation}>&gt;</span>
        </>
      )}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Type operator
 * ---------------------------------------------------------------------------------------------*/

function TypeOperatorType({
  operator,
  value,
}: {
  operator: string;
  value: TType;
}) {
  return (
    <>
      <span className={styles.keyword}>{operator}</span>{" "}
      {renderType(value)}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Function type
 * ---------------------------------------------------------------------------------------------*/

function FunctionType({
  parameters,
  returnType,
  typeParameters,
  name,
}: {
  parameters: TParameter[];
  returnType: TType;
  typeParameters: TTypeParameter[];
  name?: string;
}) {
  return (
    <>
      {name && <span className={styles.function}>{name}</span>}
      {typeParameters.length > 0 && (
        <>
          <span className={styles.punctuation}>&lt;</span>
          {typeParameters.map((tp, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className={styles.punctuation}>, </span>}
              <TypeParameterType param={tp} />
            </React.Fragment>
          ))}
          <span className={styles.punctuation}>&gt;</span>
        </>
      )}
      <span className={styles.punctuation}>(</span>
      {parameters.map((param, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.punctuation}>, </span>}
          <ParameterType param={param} />
        </React.Fragment>
      ))}
      <span className={styles.punctuation}>)</span>
      <span className={styles.punctuation}>{name ? ": " : " => "}</span>
      {renderType(returnType)}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Parameter type
 * ---------------------------------------------------------------------------------------------*/

function ParameterType({ param }: { param: TParameter }) {
  return (
    <>
      {param.rest && <span className={styles.punctuation}>...</span>}
      <span>{param.name}</span>
      {param.optional && <span className={styles.punctuation}>?</span>}
      {param.value && (
        <>
          <span className={styles.punctuation}>: </span>
          {renderType(param.value)}
        </>
      )}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Link type (navigable)
 * ---------------------------------------------------------------------------------------------*/

function LinkType({ id, name }: { id: string; name: string }) {
  const { links } = useTypeLinks();
  const linkedType = links[id];

  if (!linkedType) {
    return <span className={styles.variable}>{name}</span>;
  }

  return <TypeLink id={id} name={name} type={linkedType} />;
}

/* -----------------------------------------------------------------------------------------------
 * Interface type
 * ---------------------------------------------------------------------------------------------*/

function InterfaceTypeView({ iface }: { iface: TInterface }) {
  const properties = Object.values(iface.properties || {});

  if (properties.length === 0) {
    return (
      <>
        <span className={styles.keyword}>interface</span>{" "}
        <span className={styles.variable}>{iface.name}</span>{" "}
        <span className={styles.punctuation}>{"{}"}</span>
      </>
    );
  }

  return (
    <div className="space-y-1">
      {properties.map((prop, i) => (
        <div key={i} className="pl-4">
          {prop.type === "method" ? (
            <MethodType method={prop} />
          ) : (
            <PropertyType prop={prop} />
          )}
          {prop.description && (
            <div className="text-fg-muted text-xs mt-0.5">{prop.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Alias type
 * ---------------------------------------------------------------------------------------------*/

function AliasType({ alias }: { alias: TAlias }) {
  return renderType(alias.value);
}

/* -----------------------------------------------------------------------------------------------
 * Object type
 * ---------------------------------------------------------------------------------------------*/

function ObjectType({
  properties,
}: {
  properties: Record<string, TProperty | TMethod> | null;
}) {
  if (!properties || Object.keys(properties).length === 0) {
    return <span className={styles.punctuation}>{"{}"}</span>;
  }

  const props = Object.values(properties);

  return (
    <>
      <span className={styles.punctuation}>{"{ "}</span>
      {props.map((prop, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.punctuation}>; </span>}
          {prop.type === "method" ? (
            <MethodType method={prop} inline />
          ) : (
            <PropertyType prop={prop} inline />
          )}
        </React.Fragment>
      ))}
      <span className={styles.punctuation}>{" }"}</span>
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Property type
 * ---------------------------------------------------------------------------------------------*/

function PropertyType({
  prop,
  inline,
}: {
  prop: TProperty;
  inline?: boolean;
}) {
  return (
    <>
      {prop.readonly && (
        <>
          <span className={styles.keyword}>readonly</span>{" "}
        </>
      )}
      <span className={styles.attribute}>{prop.name}</span>
      {prop.optional && <span className={styles.punctuation}>?</span>}
      <span className={styles.punctuation}>: </span>
      {renderType(prop.value)}
      {!inline && <span className={styles.punctuation}>;</span>}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Method type
 * ---------------------------------------------------------------------------------------------*/

function MethodType({
  method,
  inline,
}: {
  method: TMethod;
  inline?: boolean;
}) {
  return (
    <>
      <span className={styles.function}>{method.name}</span>
      {method.optional && <span className={styles.punctuation}>?</span>}
      <span className={styles.punctuation}>(</span>
      {method.value.parameters.map((param, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.punctuation}>, </span>}
          <ParameterType param={param} />
        </React.Fragment>
      ))}
      <span className={styles.punctuation}>): </span>
      {renderType(method.value.return)}
      {!inline && <span className={styles.punctuation}>;</span>}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Array type
 * ---------------------------------------------------------------------------------------------*/

function ArrayType({ elementType }: { elementType: TType }) {
  // Check if we need parentheses (for union/intersection types)
  const needsParens =
    elementType.type === "union" || elementType.type === "intersection";

  return (
    <>
      {needsParens && <span className={styles.punctuation}>(</span>}
      {renderType(elementType)}
      {needsParens && <span className={styles.punctuation}>)</span>}
      <span className={styles.punctuation}>[]</span>
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Tuple type
 * ---------------------------------------------------------------------------------------------*/

function TupleType({ elements }: { elements: TType[] }) {
  return (
    <>
      <span className={styles.punctuation}>[</span>
      {elements.map((el, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.punctuation}>, </span>}
          {renderType(el)}
        </React.Fragment>
      ))}
      <span className={styles.punctuation}>]</span>
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Type parameter
 * ---------------------------------------------------------------------------------------------*/

function TypeParameterType({ param }: { param: TTypeParameter }) {
  return (
    <>
      <span className={styles.variable}>{param.name}</span>
      {param.constraint && (
        <>
          <span className={styles.keyword}> extends </span>
          {renderType(param.constraint)}
        </>
      )}
      {param.default && (
        <>
          <span className={styles.punctuation}> = </span>
          {renderType(param.default)}
        </>
      )}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Conditional type
 * ---------------------------------------------------------------------------------------------*/

function ConditionalType({ conditional }: { conditional: TConditional }) {
  return (
    <>
      {renderType(conditional.checkType)}
      <span className={styles.keyword}> extends </span>
      {renderType(conditional.extendsType)}
      <span className={styles.punctuation}> ? </span>
      {renderType(conditional.trueType)}
      <span className={styles.punctuation}> : </span>
      {renderType(conditional.falseType)}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Indexed access type
 * ---------------------------------------------------------------------------------------------*/

function IndexedAccessType({
  objectType,
  indexType,
}: {
  objectType: TType;
  indexType: TType;
}) {
  return (
    <>
      {renderType(objectType)}
      <span className={styles.punctuation}>[</span>
      {renderType(indexType)}
      <span className={styles.punctuation}>]</span>
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Keyof type
 * ---------------------------------------------------------------------------------------------*/

function KeyofType({ keyof }: { keyof: TType }) {
  return (
    <>
      <span className={styles.keyword}>keyof </span>
      {renderType(keyof)}
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Template literal type
 * ---------------------------------------------------------------------------------------------*/

function TemplateType({ elements }: { elements: TType[] }) {
  return (
    <>
      <span className={styles.string}>`</span>
      {elements.map((el, i) => {
        if (el.type === "stringLiteral") {
          return (
            <span key={i} className={styles.string}>
              {el.value}
            </span>
          );
        }
        return (
          <React.Fragment key={i}>
            <span className={styles.punctuation}>{"${"}</span>
            {renderType(el)}
            <span className={styles.punctuation}>{"}"}</span>
          </React.Fragment>
        );
      })}
      <span className={styles.string}>`</span>
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Mapped type
 * ---------------------------------------------------------------------------------------------*/

function MappedType({
  typeParameter,
  typeAnnotation,
}: {
  typeParameter: TTypeParameter;
  typeAnnotation: TType;
}) {
  return (
    <>
      <span className={styles.punctuation}>{"{ ["}</span>
      <TypeParameterType param={typeParameter} />
      <span className={styles.punctuation}>{"]"}: </span>
      {renderType(typeAnnotation)}
      <span className={styles.punctuation}>{" }"}</span>
    </>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Parenthesized type
 * ---------------------------------------------------------------------------------------------*/

function ParenthesizedType({ value }: { value: TType }) {
  return (
    <>
      <span className={styles.punctuation}>(</span>
      {renderType(value)}
      <span className={styles.punctuation}>)</span>
    </>
  );
}

