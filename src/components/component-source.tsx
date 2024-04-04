import React from "react";
import { Code } from "bright";
import { tabs } from "@/components/code-highlighter/code-tabs";
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
    <Code
      subProps={code.map((file, index) => ({
        title: file.title,
        code: file.code,
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
