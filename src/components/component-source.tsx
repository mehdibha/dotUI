import React from "react";
import { Code } from "bright";
import { tabs } from "@/components/code-highlighter/code-tabs";
import { CodeBlock } from "@/lib/components/core/default/code-block";
import { getComponentSource } from "@/server/component-source";

export const ComponentSource = ({
  name,
  titles,
  className,
}: {
  name: string;
  titles?: string[];
  className?: string;
}) => {
  const code = getComponentSource(name);

  if (code.length === 0) {
    return <p>Source code not found</p>;
  }

  return (
    <CodeBlock
      language="tsx"
      fileName={code.map((file) => file.title)}
      code={code.map((file) => file.code.replace(/[\r\n]+$/, ""))}
      className={className}
    />
  );

  return (
    <Code
      subProps={code.map((file, index) => ({
        title: file.title,
        code: file.code.replace(/[\r\n]+$/, ""),
        lang: "tsx",
        ...(titles?.[index] && { title: titles[index] }),
      }))}
      theme="github-dark-dimmed"
      codeClassName="text-xs"
      extensions={[tabs]}
      className={className}
    />
  );
};
