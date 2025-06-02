import * as React from "react";

export function useIsMobile() {
  const [isMobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setMobile(event.matches);
    }

    const result = matchMedia("(max-width: 640px)");
    result.addEventListener("change", onChange);
    setMobile(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
