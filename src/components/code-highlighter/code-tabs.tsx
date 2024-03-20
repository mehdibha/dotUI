import { Code, type Extension, type BrightProps } from "bright";
import { TabsRoot, TabsContent, TabsList } from "./client";
import { CopyButton } from "./copy-button";

export const title: Extension = {
  name: "title",
  beforeHighlight: (props, annotations) => {
    if (annotations.length > 0) {
      return { ...props, title: annotations[0].query };
    }
  },
};

export function CodeTabs({ children }: { children: React.ReactNode }) {
  return (
    <Code theme="github-dark-dimmed" codeClassName="text-xs" extensions={[title, tabs]}>
      {children}
    </Code>
  );
}

export function TitleBarComponent(brightProps: BrightProps) {
  const { subProps, title, Tab } = brightProps;
  const titles = (
    subProps?.length ? subProps.map((subProp) => subProp.title) : [title]
  ) as string[];
  const childProps = subProps?.length ? subProps : [brightProps];

  return (
    <TabsList titles={titles}>
      {titles.map((title, i) => {
        // @ts-expect-error - -
        return <Tab key={title} {...childProps[i]} />;
      })}
    </TabsList>
  );
}

export function Root(brightProps: BrightProps) {
  const { subProps, title } = brightProps;

  const titles = subProps?.length ? subProps.map((subProp) => subProp.title) : [title];

  return (
    <TabsRoot defaultValue={titles[0]!}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
[data-bright-tab][data-state="inactive"]{ 
  --tab-background: var(--inactive-tab-background);
  --tab-color: var(--inactive-tab-color);; 
  --tab-bottom-border: transparent;
  --tab-top-border: transparent;
}`,
        }}
      />
      {/* @ts-expect-error - - */}
      <Code.Root {...brightProps} />
    </TabsRoot>
  );
}

export function Content(brightProps: BrightProps) {
  const { subProps, code } = brightProps;
  const propsList = subProps?.length ? subProps : [brightProps];

  const getCode = (title: string): string => {
    if (!subProps?.length) return code;
    const currentCode = subProps.find((subProp) => subProp.title === title)?.code;

    return currentCode!;
  };

  return (
    <>
      {propsList.map((props) => (
        <TabsContent key={props.title} value={props.title!} className="relative">
          <CopyButton
            code={getCode(props.title!)}
            className="absolute right-4 top-2 z-50"
          />
          {/* @ts-expect-error - - */}
          <Code.Pre {...props} test="this is a test" />
        </TabsContent>
      ))}
    </>
  );
}

/** @type {import("bright").Extension} */
export const tabs = {
  name: "tabs",
  Root,
  TitleBarContent: TitleBarComponent,
  Pre: Content,
};
