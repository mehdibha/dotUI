import { restoreStyleDefinitionDefaults } from "@dotui/style-engine";
import { StyleProvider } from "@dotui/ui";
import { Button } from "@dotui/ui/components/button";

export default function InternalPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div
        className="flex size-100 items-center justify-center bg-bg-danger"
        style={{ color: "var(--on-danger-400)" }}
      >
        <span>Hello world</span>
      </div>
    </div>
  );
}
