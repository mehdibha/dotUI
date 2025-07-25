"use client";

import type { ButtonProps } from "@/components/ui/button";
import type { ScrollAreaProps } from "@/components/ui/scroll-area";
import type { TabsProps } from "@/components/ui/tabs";
import type { Key } from "react-aria-components";
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { tv } from "tailwind-variants";

const codeBlockStyles = tv({
  slots: {
    root: "block w-fit max-w-full rounded-md border",
    header:
      "bg-bg-muted flex h-10 items-center justify-between rounded-t-[inherit] border-b pr-2",
    body: "bg-bg-muted/30 p-4 text-xs",
    code: "text-xs",
  },
});

interface CodeBlockClientProps {
  files: {
    fileName: string;
    code: React.ReactNode;
    codeStr: string;
    lang: string;
  }[];
  preview?: React.ReactNode;
  previewStr?: string;
  expandable?: boolean;
}
const CodeBlockClient = ({
  files,
  preview,
  previewStr,
  expandable = false,
  ...props
}: CodeBlockClientProps) => {
  // @ts-expect-error fix later
  const [activeTab, setActiveTab] = React.useState<Key>(files[0].fileName);
  const [isExpanded, setExpanded] = React.useState(false);
  const handleExpand = () => {
    const prevState = isExpanded;
    if (prevState) {
      // @ts-expect-error fix later
      setActiveTab(files[0].fileName);
    }
    setExpanded(!prevState);
  };
  return (
    <CodeBlockRoot
      selectedKey={activeTab}
      onSelectionChange={setActiveTab}
      {...props}
    >
      <CodeBlockHeader>
        <div className="flex h-full w-[100px] flex-1 shrink-1 basis-0 items-end gap-2">
          {files.length > 0 && (
            <TabList>
              {files
                .slice(0, preview && !isExpanded ? 1 : files.length)
                .map(({ fileName }, index) => (
                  <Tab key={index} id={fileName}>
                    {fileName}
                  </Tab>
                ))}
            </TabList>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(preview || expandable) && (
            <Button
              variant="outline"
              size="sm"
              className="bg-bg-inverse/5 h-7 text-xs"
              onPress={handleExpand}
            >
              {isExpanded ? "Collapse" : "Expand"} code
            </Button>
          )}
          <CodeBlockCopyButton
            code={
              (previewStr && !isExpanded
                ? previewStr
                : files.find(({ fileName }) => fileName === activeTab)
                    ?.codeStr)!
            }
          />
        </div>
      </CodeBlockHeader>
      <CodeBlockBody
        className={cn(isExpanded ? "max-h-[400px]" : "max-h-[200px]")}
      >
        {preview && !isExpanded ? (
          // @ts-expect-error fix later
          <TabPanel id={files[0].fileName} className="mt-0!">
            {preview}
          </TabPanel>
        ) : (
          files.map(({ fileName, code }, index) => (
            <TabPanel key={index} id={fileName} className="mt-0!">
              {code}
            </TabPanel>
          ))
        )}
      </CodeBlockBody>
    </CodeBlockRoot>
  );
};

type CodeBlockRootProps = Omit<TabsProps, "className"> & { className?: string };
const CodeBlockRoot = ({ className, ...props }: CodeBlockRootProps) => {
  const { root } = codeBlockStyles();
  return <Tabs className={root({ className })} {...props} />;
};

type CodeBlockHeaderProps = React.HTMLAttributes<HTMLDivElement>;
const CodeBlockHeader = ({ className, ...props }: CodeBlockHeaderProps) => {
  const { header } = codeBlockStyles();
  return <div className={header({ className })} {...props} />;
};

type CodeBlockBodyProps = ScrollAreaProps;
const CodeBlockBody = ({ className, ...props }: CodeBlockBodyProps) => {
  const { body } = codeBlockStyles();
  return (
    <ScrollArea scrollbars="both" className={body({ className })} {...props} />
  );
};

interface CodeBlockCopyButtonProps extends ButtonProps {
  code: string;
}
const CodeBlockCopyButton = ({ code, ...props }: CodeBlockCopyButtonProps) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  return (
    <Button
      size="sm"
      shape="square"
      variant="outline"
      onPress={handleCopy}
      className="bg-bg-inverse/5 size-7 [&_svg]:size-3"
      {...props}
    >
      {copied ? (
        <CheckIcon className="animate-in fade-in" />
      ) : (
        <CopyIcon className="animate-in fade-in" />
      )}
    </Button>
  );
};

export type {
  CodeBlockClientProps,
  CodeBlockRootProps,
  CodeBlockHeaderProps,
  CodeBlockBodyProps,
  CodeBlockCopyButtonProps,
};

export {
  CodeBlockClient,
  CodeBlockRoot,
  CodeBlockHeader,
  CodeBlockBody,
  CodeBlockCopyButton,
  codeBlockStyles,
};
