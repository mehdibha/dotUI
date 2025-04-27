import React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import type { BundledLanguage } from "shiki";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { codeToHtml } from "@/modules/docs/actions/code-to-html";

interface CodeProps extends Omit<React.ComponentProps<"div">, "children"> {
  children: string;
  lang?: BundledLanguage;
  structure?: "classic" | "inline";
}

const Code = ({ children, lang = "tsx", className, ...props }: CodeProps) => {
  const [html, setHtml] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  React.useEffect(() => {
    const convert = async () => {
      setIsLoading(true);
      if (!children || typeof children !== "string") return;
      const html = await codeToHtml(children, { lang });
      setIsLoading(false);
      setHtml(html);
    };
    convert();
  }, [children, lang]);

  return (
    <Skeleton show={isLoading}>
      <div
        className={cn(
          "bg-bg-muted flex items-center gap-2 rounded-md border py-2 pl-4 pr-2 font-mono",
          className
        )}
        {...props}
      >
        {html ? (
          <div
            className="[&_pre]:outline-hidden [&_span]:bg-transparent! dark:[&_span]:text-(--shiki-dark)!"
            dangerouslySetInnerHTML={{ __html: html }}
            {...props}
          />
        ) : (
          <pre>
            <code>{children}</code> {/* to preserve the layout */}
          </pre>
        )}
        <Button
          variant="quiet"
          shape="square"
          size="sm"
          onPress={handleCopy}
          className="text-fg-muted [&_svg]:size-3.5"
        >
          {copied ? (
            <CheckIcon className="animate-in fade-in" />
          ) : (
            <CopyIcon className="animate-in fade-in" />
          )}
        </Button>
      </div>
    </Skeleton>
  );
};

export { Code };
