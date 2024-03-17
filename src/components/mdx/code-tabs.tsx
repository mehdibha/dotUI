import { Code, type Extension } from "bright";
import { tabs } from "./code-tabs-extension";

const title: Extension = {
  name: "title",
  beforeHighlight: (props, annotations) => {
    if (annotations.length > 0) {
      return { ...props, title: annotations[0].query };
    }
  },
};

export function CodeTabs({ children }: { children: React.ReactNode }) {
  return (
    <Code theme="github-dark-dimmed" extensions={[title, tabs]}>
      {children}
    </Code>
  );
}
