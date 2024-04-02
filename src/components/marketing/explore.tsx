export const Explore = ({ className }: { className: string }) => {
  return (
    <div className={className}>
      <h2 className="text-3xl font-semibold">Explore</h2>
      <div className="mt-6 -space-y-2">
        <div>
          <h3 className="category-xl pl-6 font-mono text-xl tracking-widest text-muted-foreground">
            components
          </h3>
          <div className="border-l border-muted pb-8 pl-6 pt-4">
            <GridItems />
          </div>
        </div>
        <div>
          <h3 className="category-xl pl-6 font-mono text-xl tracking-widest text-muted-foreground">
            hooks
          </h3>
          <div className="border-l border-muted pb-8 pl-6 pt-4">
            <GridItems />
          </div>
        </div>
        <div>
          <h3 className="category-xl pl-6 font-mono text-xl tracking-widest text-muted-foreground">
            blocks
          </h3>
          <div className="border-l border-muted pb-8 pl-6 pt-4">
            <GridItems />
          </div>
        </div>
        <div>
          <h3 className="category-xl pl-6 font-mono text-xl tracking-widest text-muted-foreground">
            Animations
          </h3>
          <div className="border-l border-muted pb-1 pl-6 pt-4">
            <GridItems />
          </div>
        </div>
      </div>
    </div>
  );
};

const GridItems = () => {
  return (
    <div className="grid grid-cols-6 items-center gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex h-44 rounded-lg bg-card">
          <span className="text-sm"></span>
        </div>
      ))}
    </div>
  );
};
