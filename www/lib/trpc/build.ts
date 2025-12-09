import { appRouter, createTRPCContext } from "@dotui/api";

const authStub = {
	api: {
		getSession: async () => null,
	},
} as const;

const createBuildTimeContext = async () => {
	const headers = new Headers();
	headers.set("x-trpc-source", "build");

	return createTRPCContext({
		headers,
		auth: authStub as any,
	});
};

export const buildTimeCaller = appRouter.createCaller(createBuildTimeContext);
