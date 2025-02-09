import React from "react";

export const useSimulateApiCall = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const simulateApiCall = async () => {
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    onSuccess?.();
  };

  return { status, simulateApiCall };
};
