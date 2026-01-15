import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { db } from "@dotui/db/client";

import { appRouter } from "./root";
import { createCallerFactory, createTRPCContext } from "./trpc";
import type { AppRouter } from "./root";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

/** Server-side caller for public (unauthenticated) procedures */
const publicCaller = createCallerFactory(appRouter)({
	db,
	session: null,
	authApi: undefined as never,
});

export { appRouter, createTRPCContext, publicCaller };
export type { AppRouter, RouterInputs, RouterOutputs };
