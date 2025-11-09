import { Empty } from "@dotui/registry/ui/empty";

export default function Page() {
  return (
    <Empty>
      <Empty.Icon />
      <Empty.Title>No data available</Empty.Title>
      <Empty.Description>
        There are no items to display at the moment.
      </Empty.Description>
    </Empty>
  );
}

