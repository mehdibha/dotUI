import React from "react";
import { codeToHtml } from "shiki";

import { CodeClient } from "./code-client";

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
  code?: string;
  lang?: string;
  inline?: boolean;
  colorReplacements?: Record<string, string>;
}

const Code = async ({
  children,
  inline,
  lang: _lang,
  colorReplacements,
  ...props
}: CodeProps) => {
  const { code: codeStr, lang } = parseChildren(children as CodeText, _lang);
  const html = await codeToHtml(codeStr, {
    lang: lang,
    themes: {
      light: "github-light",
      dark: "github-dark-dimmed",
    },
    colorReplacements,
    structure: inline ? "inline" : "classic",
  });
  const ElementType = inline ? "span" : "div";
  const code = (
    <ElementType
      className="[&_pre]:outline-hidden [&_span]:bg-transparent! dark:[&_span]:text-(--shiki-dark)!"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  return (
    <CodeClient inline={inline} code={codeStr} {...props}>
      {code}
    </CodeClient>
  );
};

type MdCodeText = {
  type: "code";
  props: { className?: string; children: string };
};

type MdMultiCodeText = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  type: Function;
  props: {
    children: MdCodeText[];
  };
};

type CodeText = string | MdCodeText | MdMultiCodeText;

function parseChildren(
  children: CodeText,
  lang?: string,
  code?: string
): { lang: string; code: string; title?: string } {
  if (typeof children === "string" || code) {
    return {
      code: (children as string) || code || "",
      lang: lang || "text",
    };
  }

  if (
    typeof children === "object" &&
    typeof children?.props?.children === "string"
  ) {
    return {
      code: children.props?.children,
      ...getLanguageAndTitle((children as MdCodeText).props?.className),
    };
  }

  if (typeof children === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const files = React.Children.toArray(children as any).map((file: any) => {
      const code = file.props?.children;
      const className = file.props?.className;
      return {
        code: code as string,
        ...getLanguageAndTitle(className as string),
      };
    });
    //@ts-expect-error - This is a valid case
    return files[0];
  }

  return {
    code: (children as string) || code || "",
    lang: lang || "text",
  };
}

function getLanguageAndTitle(className: string | undefined) {
  if (!className) {
    return { lang: "text" };
  }
  const metastring = className.replace("language-", "");
  const lang = metastring.split(".").pop()!;

  if (lang !== metastring) {
    return { lang, title: metastring };
  }
  return { lang };
}

export { Code };
