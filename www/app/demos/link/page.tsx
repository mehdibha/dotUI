import { Link } from "@dotui/registry/ui/link";

export default function Page() {
  return (
    <div className="flex gap-4">
      <Link href="#">Link</Link>
      <Link href="#" variant="accent">
        Accent Link
      </Link>
    </div>
  );
}

