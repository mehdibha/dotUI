export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold ">Hooks</h1>
      <p className="mt-2 text-muted-foreground">
        Copy and paste hooks for your React app
      </p>
      <div className="mt-16 grid grid-cols-3 gap-4">
        {[
          {
            label: "useCopyToClipboard",
            description:
              "A spotlight effect that follows the cursor and highlights contents on element hover.",
          },
          {
            label: "useDebounce",
            description:
              "A dotted grid of glowing stars with a featured animated element.",
          },
          {
            label: "useLocalStorage",
            description:
              "A dotted grid of glowing stars with a featured animated element.",
          },
        ].map((component, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-md bg-card p-2 transition-colors duration-100 hover:bg-card/70"
          >
            {/* <div className="aspect-video rounded-sm bg-background"></div> */}
            <div className="p-3">
              <p className="mt- text-lg font-semibold">{component.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {component.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
