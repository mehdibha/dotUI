import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
} satisfies TRPCRouterRecord;
