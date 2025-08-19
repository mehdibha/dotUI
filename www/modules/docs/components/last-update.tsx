export function PageLastUpdate({ date }: { date: Date }) {
  return (
    <p className="text-fg-muted text-sm">
      Last updated on {new Date(date).toLocaleDateString()}
    </p>
  );
}
