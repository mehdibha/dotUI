export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-12">
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        {children}
      </article>
    </div>
  );
}