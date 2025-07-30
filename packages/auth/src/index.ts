import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";
import type { BetterAuthOptions } from "better-auth";

import { db } from "@dotui/db/client";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
  githubClientId: string;
  githubClientSecret: string;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    logger: {
      disabled: false,
      level: "debug", // Show all logs including debug information
      log: (level, message, ...args) => {
        // Enhanced logging with timestamps and better formatting
        const timestamp = new Date().toISOString();
        console.log(
          `[${timestamp}] [BETTER-AUTH] [${level.toUpperCase()}] ${message}`,
          ...(args as unknown[]),
        );
      },
    },
    user: {
      additionalFields: {
        username: {
          type: "string",
          required: true,
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
    ],
    socialProviders: {
      github: {
        clientId: options.githubClientId,
        clientSecret: options.githubClientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/github`,
        scope: ["user"],
        mapProfileToUser: (profile) => {
          console.log("Profile:", profile);
          const mappedUser = {
            username: profile.name,
            name: profile.name || profile.login,
            email: profile.email,
            image: profile.avatar_url,
          };

          return mappedUser;
        },
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
