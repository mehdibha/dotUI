import { authRouter } from "./routers/auth";
import { styleRouter } from "./routers/style";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  style: styleRouter,
});

export type AppRouter = typeof appRouter;
