import { authRouter } from "./router/auth";
import { styleRouter } from "./router/style";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  style: styleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
