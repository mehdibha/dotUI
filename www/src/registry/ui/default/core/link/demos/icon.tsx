import { ExternalLinkIcon } from "@/__icons__";
import { Link } from "@/registry/ui/default/core/link";

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
