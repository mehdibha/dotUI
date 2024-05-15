import { Avatar } from "@/lib/components/core/default/avatar";
import { HoverCard } from "@/lib/components/core/default/hover-card";
import { Link } from "@/lib/components/core/default/link";

export default function HoverCardDemo() {
  return (
    <HoverCard delay={0} closeDelay={0} content={<Content />}>
      <Link href="https://twitter.com/mehdibha_" target="_blank" className="text-fg-link">
        @mehdibha_
      </Link>
    </HoverCard>
  );
}

const Content = () => {
  return (
    <div className="flex justify-between space-x-4">
      <Avatar src="https://github.com/mehdibha.png" fallback="M" />
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-md font-semibold leading-normal">Mehdi</h4>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            version="1.1"
            viewBox="0 0 22 22"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            color="rgba(29,155,240,1.00)"
          >
            <path d="M20.396 11a3.487 3.487 0 0 0-2.008-3.062 3.474 3.474 0 0 0-.742-3.584 3.474 3.474 0 0 0-3.584-.742A3.468 3.468 0 0 0 11 1.604a3.463 3.463 0 0 0-3.053 2.008 3.472 3.472 0 0 0-1.902-.14c-.635.13-1.22.436-1.69.882a3.461 3.461 0 0 0-.734 3.584A3.49 3.49 0 0 0 1.604 11a3.496 3.496 0 0 0 2.017 3.062 3.471 3.471 0 0 0 .733 3.584 3.49 3.49 0 0 0 3.584.742A3.487 3.487 0 0 0 11 20.396a3.476 3.476 0 0 0 3.062-2.007 3.335 3.335 0 0 0 4.326-4.327A3.487 3.487 0 0 0 20.396 11zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
          </svg>
        </div>
        <h4 className="text-sm text-fg-muted">@mehdibha_</h4>
        <p className="mt-2 text-sm">
          I tell computers to do things. Building{" "}
          <Link href="https://rcopy.dev" className="text-fg-link">
            rcopy.dev
          </Link>
        </p>
      </div>
    </div>
  );
};
