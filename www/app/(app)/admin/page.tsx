import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="container space-y-4">
      <p>Select a section:</p>
      <ul className="list-disc pl-5">
        <li>
          <Link href="/admin/styles" className="underline">
            Styles moderation
          </Link>
        </li>
      </ul>
    </div>
  );
}
