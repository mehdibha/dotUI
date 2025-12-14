import { appRouter, createTRPCContext } from "@dotui/api";
import type { Auth } from "@dotui/auth";

// Create a minimal auth stub for build time that matches the expected Auth API signature
const authStub = {
	api: {
		getSession: async (_context: { headers: Headers }) => null,
	},
} as unknown as Auth;

const createBuildTimeContext = async () => {
	const headers = new Headers();
	headers.set("x-trpc-source", "build");

	return createTRPCContext({
		headers,
		auth: authStub,
	});
};

export const buildTimeCaller = appRouter.createCaller(createBuildTimeContext);
