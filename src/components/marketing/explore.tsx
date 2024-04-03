import { DocsList } from "@/components/docs/docs-list";
import { IconsList } from "./icons-list";

export const Explore = ({ className }: { className: string }) => {
  const categories = [
    { title: "components", slug: "components" },
    { title: "hooks", slug: "hooks" },
    { title: "blocks", slug: "blocks" },
    { title: "Animations", slug: "components/animations" },
  ];
  return (
    <div className={className}>
      <h2 className="text-3xl font-semibold">Explore</h2>
      <div className="mt-6 -space-y-2">
        {categories.map((category, index) => (
          <div key={index}>
            <h3 className="category-xl pl-6 font-mono text-xl tracking-widest text-muted-foreground">
              {category.title}
            </h3>
            <div className="border-l border-muted pb-8 pl-6 pt-4">
              <DocsList name={category.slug} limit={4} className="grid-cols-4" />
            </div>
          </div>
        ))}
        <div>
          <h3 className="category-xl pl-6 font-mono text-xl tracking-widest text-muted-foreground">
            Icons
          </h3>
          <div className={"grid grid-cols-16 gap-2 border-l border-muted pb-1 pl-6 pt-4"}>
            <IconsList limit={32} />
          </div>
        </div>
      </div>
    </div>
  );
};
