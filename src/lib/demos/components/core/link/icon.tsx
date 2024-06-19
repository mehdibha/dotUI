import { ExternalLinkIcon } from "lucide-react";
import { Link } from "@/lib/components/core/default/link";

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
