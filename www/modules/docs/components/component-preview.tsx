import { cn } from "@dotui/registry/lib/utils";
import { Alert } from "@dotui/registry/ui/alert";
import { Index } from "@dotui/registry/ui/demos";
import { Label } from "@dotui/registry/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Switch } from "@dotui/registry/ui/switch";

import { getFileSource } from "@/modules/docs/lib/get-file-source";
import { ActiveStyleProvider } from "@/modules/styles/components/active-style-provider";
import { CodeBlock } from "./code-block";
import {
  ComponentPreviewHeader,
  ResizableContainer,
} from "./component-preview-client";

export interface ComponentPreviewProps {
  name: string;
  containerClassName?: string;
  className?: string;
  preview?: string;
  expandable?: boolean;
  fullWidth?: boolean;
  resizable?: boolean;
  suspense?: boolean;
  primary?: boolean;
  controls?: boolean;
}

export const ComponentPreview = async ({
  name,
  containerClassName,
  preview,
  expandable = true,
  fullWidth = false,
  resizable = false,
  primary = false,
  controls = false,
}: ComponentPreviewProps) => {
  const demoItem = Index[name];

  if (!demoItem) {
    return (
      <div
        className={cn("flex items-center justify-center", containerClassName)}
      >
        <Alert>Preview not found</Alert>
      </div>
    );
  }

  const Component = demoItem.component;

  const code: { fileName: string; code: string }[] = demoItem.files.map(
    (file: string) => {
      const { fileName, content } = getFileSource(file);
      return {
        fileName,
        code: content,
      };
    },
  );

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="relative flex flex-col">
        <div className="flex items-stretch">
          <ActiveStyleProvider className="flex-1 rounded-t-lg border">
            <ComponentPreviewHeader />
            <ResizableContainer resizable={resizable}>
              <div
                className={cn(
                  "flex rounded-t-md bg-bg pt-20 pb-14",
                  primary && "min-h-48 pt-24 pb-20",
                  fullWidth
                    ? "px-8 lg:px-12"
                    : "flex items-center justify-center px-4",
                )}
              >
                <div
                  className={cn(
                    fullWidth ? "w-full" : "flex items-center justify-center",
                  )}
                >
                  <Component />
                </div>
              </div>
            </ResizableContainer>
          </ActiveStyleProvider>
          {controls && (
            <div className="-ml-2 w-32 space-y-2 rounded-tr-md border border-l-0 bg-card/50 p-3 pl-5 **:data-[slot=label]:text-xs">
              <Select defaultValue="primary" className="w-full">
                <Label>Variant</Label>
                <SelectTrigger
                  size="sm"
                  className="h-7 w-full border-0 text-xs"
                />
                <SelectContent>
                  <SelectItem id="primary">Primary</SelectItem>
                  <SelectItem id="secondary">Secondary</SelectItem>
                  <SelectItem id="quiet">Quiet</SelectItem>
                  <SelectItem id="link">Link</SelectItem>
                  <SelectItem id="danger">Danger</SelectItem>
                  <SelectItem id="success">Success</SelectItem>
                  <SelectItem id="warning">Warning</SelectItem>
                  <SelectItem id="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <Label>isPending</Label>
                <Switch size="sm" />
              </div>
              <div>
                <Label>isDisabled</Label>
                <Switch size="sm" />
              </div>
            </div>
          )}
        </div>
        <CodeBlock
          files={code.map((file) => ({
            fileName: file.fileName,
            code: file.code,
            lang: "tsx",
          }))}
          preview={preview}
          className={"w-full rounded-t-none border border-t-0"}
          expandable={expandable}
        />
      </div>
    </div>
  );
};
