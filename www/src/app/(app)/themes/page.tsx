import { Link } from "next-view-transitions";

export default function Page() {
  return (
    <div className="pt-16">
      <h2 className="w-fit text-2xl font-semibold [view-transition-name:themes-title]">
        themes
      </h2>
      <div className="mt-6">
        <Link href="/themes/theme" className="">
          go to theme
        </Link>
      </div>
    </div>
  );
}
