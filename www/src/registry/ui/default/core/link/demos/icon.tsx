import { Link } from "@/registry/ui/default/core/link";
import { ExternalLinkIcon } from "@/__icons__";

export default function Demo() {
  return (
    <Link href="/docs" target="_blank">
      Docs{" "}
      <span>
        <ExternalLinkIcon className="size-4" />
      </span>
    </Link>
  );
}
