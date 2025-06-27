import type { TRPCRouterRecord } from "@trpc/server";


import { publicProcedure } from "../trpc";

export const styleRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.style.findMany({
      limit: 10,
    });
  }),
} satisfies TRPCRouterRecord;
