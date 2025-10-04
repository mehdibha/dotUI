export function PageLastUpdate({ date }: { date: Date }) {
  return (
    <p className="text-sm text-fg-muted">
      Last updated on {new Date(date).toLocaleDateString()}
    </p>
  );
}
