"use client";

import React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import type { Key } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { TabsProps } from "@dotui/registry/ui/tabs";

import type { ScrollAreaProps } from "@/components/ui/scroll-area";
import { ScrollArea } from "@/components/ui/scroll-area";

const codeBlockStyles = tv({
  slots: {
    root: "block w-fit max-w-full rounded-md",
    header:
      "flex h-10 abosolute top-0 left-0 right-0 items-center justify-between rounded-t-[inherit] border-y bg-muted pr-2",
    body: "p-4 text-sm bg-card border-t rounded-b-md relative",
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
      <CodeBlockBody>
        <div className="absolute top-0 left-0 right-0 gap-1 flex items-center justify-end p-2">
          {/* {(preview || expandable) && (
            <Button
              variant="default"
              size="sm"
              className="text-xs h-7"
              onPress={handleExpand}
            >
              {isExpanded ? "Collapse" : "Expand"} code
            </Button>
          )} */}
          <CodeBlockCopyButton
            code={
              (previewStr && !isExpanded
                ? previewStr
                : files.find(({ fileName }) => fileName === activeTab)
                    ?.codeStr)!
            }
          />
        </div>
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
      variant="default"
      aspect="square"
      className="size-7 [&_svg]:size-3"
      onPress={handleCopy}
      {...props}
    >
      {/* {copied ? (
        <CheckIcon className="animate-in fade-in" />
      ) : (
        <CopyIcon className="animate-in fade-in" />
      )} */}
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
