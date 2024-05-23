import React from "react";
import { Code as CodeHighlighter } from "bright";
import { CopyIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import { Button, ButtonProps } from "./button";
import { ScrollArea } from "./scroll-area";
import { TabsItem, TabsList, TabsRoot, TabsPanel, TabsRootProps } from "./tabs";

const codeBlockStyles = tv({
  slots: {
    root: "block border rounded-md w-fit max-w-full bg-bg-muted",
    header: "flex items-center justify-between border-b rounded-t-[inherit] pr-2",
    body: "",
    code: "!my-0 text-xs [&>pre]:!bg-transparent",
  },
});

interface CodeBlockProps extends CodeBlockRootProps {
  children?: string;
  fileName?: string | string[];
  code?: string | string[];
  language: string | string[];
}
const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  async ({ children, fileName, code, language, ...props }, ref) => {
    const codes = code ? (Array.isArray(code) ? code : [code]) : [children!];
    const fileNames = fileName ? (Array.isArray(fileName) ? fileName : [fileName]) : [];
    const languages = language ? (Array.isArray(language) ? language : [language]) : [];
    return (
      <CodeBlockRoot ref={ref} {...props}>
        {fileNames.length > 0 && (
          <CodeBlockHeader>
            <TabsList>
              {fileNames.map((fileName, index) => (
                <TabsItem key={index} id={fileName} className="">
                  {fileName}
                </TabsItem>
              ))}
            </TabsList>
            <CodeBlockCopyButton code="" />
          </CodeBlockHeader>
        )}
        <CodeBlockBody>
          <ScrollArea orientation="both" className="max-h-[200px]">
            {codes.map((codeString, index) => (
              <TabsPanel key={index} id={fileNames[0]}>
                <CodeBlockCode lang={languages[index]} code={codeString} />
              </TabsPanel>
            ))}
          </ScrollArea>
        </CodeBlockBody>
      </CodeBlockRoot>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

type CodeBlockRootProps = TabsRootProps;
const CodeBlockRoot = React.forwardRef<HTMLDivElement, CodeBlockRootProps>(
  ({ className, ...props }, ref) => {
    const { root } = codeBlockStyles();
    return <TabsRoot ref={ref} className={root({ className })} {...props} />;
  }
);
CodeBlockRoot.displayName = "CodeBlockRoot";

type CodeBlockHeaderProps = React.HTMLAttributes<HTMLDivElement>;
const CodeBlockHeader = React.forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({ className, ...props }, ref) => {
    const { header } = codeBlockStyles();
    return <div ref={ref} className={header({ className })} {...props} />;
  }
);
CodeBlockHeader.displayName = "CodeBlockHeader";

type CodeBlockBodyProps = React.HTMLAttributes<HTMLDivElement>;
const CodeBlockBody = React.forwardRef<HTMLDivElement, CodeBlockBodyProps>(
  ({ className, ...props }, ref) => {
    const { body } = codeBlockStyles();
    return <div ref={ref} className={body({ className })} {...props} />;
  }
);
CodeBlockBody.displayName = "CodeBlockBody";

type CodeBlockCodeProps = React.ComponentProps<typeof CodeHighlighter>;
const CodeBlockCode = ({ className, ...props }: CodeBlockCodeProps) => {
  const { code } = codeBlockStyles();
  return (
    <CodeHighlighter
      theme={{
        light: "light-plus",
        dark: "github-dark-dimmed",
        lightSelector: ".light",
      }}
      className={code({ className })}
      {...props}
    />
  );
};

interface CodeBlockCopyButtonProps extends ButtonProps {
  code: string;
}
const CodeBlockCopyButton = ({ code, ...props }: CodeBlockCopyButtonProps) => {
  // const handleCopy = () => {
  //   void navigator.clipboard.writeText(code);
  // };
  return (
    <Button size="sm" shape="square" variant="ghost" className="size-7" {...props}>
      <CopyIcon className="size-5" />
    </Button>
  );
};

export { CodeBlock, CodeBlockCode, codeBlockStyles };
