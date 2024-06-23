import React from "react";
import { CodeBlock } from "@/components/code-block";
import { getComponentSource } from "@/server/component-source";

export const ComponentSource = ({
  name,
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
      files={code.map((file) => ({ fileName: file.title, code: file.code, lang: "tsx" }))}
      className={className}
    />
  );
};
