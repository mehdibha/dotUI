import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";

import { db } from "@dotui/db/client";

export function initAuth<TExtraPlugins extends BetterAuthPlugin[] = []>(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
  githubClientId: string;
  githubClientSecret: string;
  extraPlugins?: TExtraPlugins;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    user: {
      additionalFields: {
        username: {
          type: "string",
          required: false,
        },
        activeStyleId: {
          type: "string",
          required: false,
        },
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false,
        },
        banned: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false,
        },
        banReason: {
          type: "string",
          required: false,
          input: false,
        },
        banExpires: {
          type: "date",
          required: false,
          input: false,
        },
      },
    },
    plugins: [
      oAuthProxy({
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      ...(options.extraPlugins ?? []),
    ],
    socialProviders: {
      github: {
        clientId: options.githubClientId,
        clientSecret: options.githubClientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/github`,
        mapProfileToUser: (profile) => {
          return {
            username: profile.login,
          };
        },
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
