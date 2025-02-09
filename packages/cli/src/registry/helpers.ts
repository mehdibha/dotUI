import { REGISTRY_URL } from "@/constants";
import { isUrl, c } from "@/utils";

function getRegistryUrl(path: string) {
  if (isUrl(path)) {
    const url = new URL(path);
    return url.toString();
  }

  return `${REGISTRY_URL}/${path}`;
}

export async function fetchRegistry(paths: string[]) {
  const results = await Promise.all(
    paths.map(async (path) => {
      const url = getRegistryUrl(path);
      const response = await fetch(url);

      if (!response.ok) {
        const errorMessages: { [key: number]: string } = {
          400: "Bad request",
          401: "Unauthorized",
          403: "Forbidden",
          404: "Not found",
          500: "Internal server error",
        };

        if (response.status === 401) {
          throw new Error(
            `You are not authorized to access the component at ${c.info(
              url
            )}.\nIf this is a remote registry, you may need to authenticate.`
          );
        }

        if (response.status === 404) {
          throw new Error(
            `The component at ${c.info(
              url
            )} was not found.\nIt may not exist at the registry. Please make sure it is a valid component.`
          );
        }

        if (response.status === 403) {
          throw new Error(
            `You do not have access to the component at ${c.info(
              url
            )}.\nIf this is a remote registry, you may need to authenticate or a token.`
          );
        }

        const result = await response.json();
        const message =
          result && typeof result === "object" && "error" in result
            ? result.error
            : response.statusText || errorMessages[response.status];
        throw new Error(`Failed to fetch from ${c.info(url)}.\n${message}`);
      }

      return response.json();
    })
  );

  return results;
}
