import React from "react";
import { Code as CodeHighlighter } from "bright";
import { CopyIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import { Button, ButtonProps } from "./button";
import { ScrollArea } from "./scroll-area";
import { Tab, TabList, TabPanel, TabsProps, Tabs } from "./tabs";

const codeBlockStyles = tv({
  slots: {
    root: "block border rounded-md w-fit max-w-full bg-bg-muted",
    header: "flex items-center justify-between border-b rounded-t-[inherit] pr-2 h-10",
    body: "",
    code: "!my-0 text-xs [&>pre]:!bg-transparent",
  },
});

interface CodeBlockProps extends CodeBlockRootProps {
  children?: string;
  toolbar?: React.ReactNode;
  fileName?: string | string[];
  code?: string | string[];
  language: string | string[];
}
const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  async ({ children, fileName, code, language, toolbar, ...props }, ref) => {
    const codes = code ? (Array.isArray(code) ? code : [code]) : [children!];
    const fileNames = fileName ? (Array.isArray(fileName) ? fileName : [fileName]) : [];
    const languages = language ? (Array.isArray(language) ? language : [language]) : [];
    return (
      <CodeBlockRoot {...props}>
        <CodeBlockHeader>
          <div className="flex h-full items-end">
            {fileNames.length > 0 && (
              <TabList>
                {fileNames.map((fileName, index) => (
                  <Tab key={index} id={fileName} className="">
                    {fileName}
                  </Tab>
                ))}
              </TabList>
            )}
          </div>
          {toolbar}
          {/* <CodeBlockCopyButton code="" /> */}
        </CodeBlockHeader>
        <CodeBlockBody>
          <ScrollArea scrollbars="both" className="max-h-[200px]">
            {codes.map((codeString, index) => (
              <TabPanel key={index} id={fileNames[0]}>
                <CodeBlockCode lang={languages[index]} code={codeString} />
              </TabPanel>
            ))}
          </ScrollArea>
        </CodeBlockBody>
      </CodeBlockRoot>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

type CodeBlockRootProps = TabsProps;
const CodeBlockRoot = ({ className, ...props }: CodeBlockRootProps) => {
  const { root } = codeBlockStyles();
  return <Tabs className={root({ className })} {...props} />;
};

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
    <Button size="sm" shape="square" variant="quiet" className="size-7" {...props}>
      <CopyIcon className="size-5" />
    </Button>
  );
};

export { CodeBlock, CodeBlockCode, codeBlockStyles };
