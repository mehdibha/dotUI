"use client";

import React from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
} from "lucide-react";
import { tv } from "tailwind-variants";
import type { Key } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { TabPanel, Tabs } from "@dotui/registry/ui/tabs";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { TabsProps } from "@dotui/registry/ui/tabs";

import type { ScrollAreaProps } from "@/components/ui/scroll-area";
import { ScrollArea } from "@/components/ui/scroll-area";

const codeBlockStyles = tv({
  slots: {
    root: "block w-fit max-w-full rounded-md",
    header:
      "flex items-center justify-end gap-2 rounded-t-[inherit] border-y bg-card p-2",
    body: "p-4 text-[0.8125rem] bg-card/50 dark:bg-[color-mix(in_srgb,var(--color-card)_50%,black)] rounded-b-md relative",
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
      {/* <CodeBlockHeader>
        {(preview || expandable) && (
          <Button
            variant="default"
            size="sm"
            className="text-xs h-7"
            onPress={handleExpand}
          >
            {isExpanded ? "Collapse" : "Expand"} code
          </Button>
        )}
        <CodeBlockCopyButton
          code={
            (previewStr && !isExpanded
              ? previewStr
              : files.find(({ fileName }) => fileName === activeTab)?.codeStr)!
          }
        />
      </CodeBlockHeader> */}
      <div className="relative">
        <CodeBlockBody>
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
        <div className="absolute top-3.25 border-0 right-2.5 flex items-center gap-1 ">
          {(preview || expandable) && (
            <Button
              variant="quiet"
              size="sm"
              onPress={handleExpand}
              className="h-7 text-xs gap-1 pl-1 pr-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUpIcon /> Collapse
                </>
              ) : (
                <>
                  <ChevronDownIcon /> Expand
                </>
              )}
            </Button>
          )}
          <CodeBlockCopyButton
            className="border-0 text-xs"
            code={
              (previewStr && !isExpanded
                ? previewStr
                : files.find(({ fileName }) => fileName === activeTab)
                    ?.codeStr)!
            }
          />
        </div>
      </div>
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
      variant="quiet"
      {...props}
      className={cn("size-7! [&_svg]:size-3.5", props.className)}
      onPress={handleCopy}
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
