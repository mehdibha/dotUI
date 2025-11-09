import {
  ProgressBar,
  ProgressBarControl,
} from "@dotui/registry/ui/progress-bar";

export default function Page() {
  return (
    <ProgressBar aria-label="Loading" value={66} className="w-64">
      <ProgressBarControl />
    </ProgressBar>
  );
}

