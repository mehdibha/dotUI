import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import { REGISTRY_URL } from "@/constants/config";
import { handleError } from "@/helpers/handle-error";
import { isUrl } from "@/helpers/is-url";
import { logger, highlight } from "@/utils";

const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined;

export async function fetchRegistry(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const url = getRegistryUrl(path);
        const response = await fetch(url, { agent });

        if (!response.ok) {
          const errorMessages: { [key: number]: string } = {
            400: "Bad request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not found",
            500: "Internal server error",
          };
          const result = await response.json();
          const message =
            result && typeof result === "object" && "error" in result
              ? result.error
              : response.statusText || errorMessages[response.status];
          throw new Error(
            `Failed to fetch from ${highlight.info(url)}.\n${message}`
          );
        }

        return response.json();
      })
    );

    return results;
  } catch (error) {
    logger.error("\n");
    handleError(error);
    return [];
  }
}

function getRegistryUrl(path: string) {
  if (isUrl(path)) {
    const url = new URL(path);
    return url.toString();
  }
  return `${REGISTRY_URL}/${path}`;
}
