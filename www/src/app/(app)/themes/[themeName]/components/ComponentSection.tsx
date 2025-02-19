interface ComponentSectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export function ComponentSection({
  title,
  description,
  action,
  children,
}: ComponentSectionProps) {
  return (
    <div className="max-w-xs overflow-hidden rounded-sm border">
      <div className="bg-bg-muted/50 flex items-center justify-between gap-2 border-b px-4 py-2">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          {description && (
            <p className="text-fg-muted text-sm">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
