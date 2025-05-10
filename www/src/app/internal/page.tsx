import { CurrentStyleProvider } from "@/modules/styles-2/components/current-syle-provider";

export default function InternalPage() {
  return (
    <div>
      <h1>Internal page</h1>

      <CurrentStyleProvider>
        <div className="bg-bg text-fg flex size-80 items-center justify-center">
          Hello world
        </div>
      </CurrentStyleProvider>
    </div>
  );
}
