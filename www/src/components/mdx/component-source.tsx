import { getFilesSource } from "@/lib/get-files-source";
import { CodeBlock } from "@/components/code-block";

export const ComponentSource = async ({
  name,
  className,
}: {
  name: string | string[];
  className?: string;
}) => {
  let code: { title: string; code: string }[] = [];

  if (typeof name === "string") {
    code = await getFilesSource(name);
  }

  if (Array.isArray(name)) {
    for (const n of name) {
      code.push(...(await getFilesSource(n)));
    }
  }

  if (code.length === 0) {
    return <p>Source code not found</p>;
  }

  code = code.map((file) => ({
    ...file,
  }));

  return (
    <CodeBlock
      files={code.map((file) => ({
        fileName: file.title,
        code: file.code,
        lang: "tsx",
      }))}
      className={className}
      expandable
    />
  );
};
