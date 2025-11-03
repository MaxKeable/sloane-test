import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { RequestContext } from "../model/types";
import { createAdminContext } from "../middleware/admin.middleware";
import { getUsers } from "../services/users/get-all.service";
import { getAllMoveClubs } from "../services/move-club/get-all.service";
import {
  moveClubCreateRequestSchema,
  moveClubUpdateRequestSchema,
} from "../model/types/move-club";
import { createMoveClub } from "../services/move-club/create.service";
import { updateMoveClub } from "../services/move-club/update.service";
import { getOneMoveClub } from "../services/move-club/get-one.service";
import { z } from "zod";
import { deleteMoveClub } from "../services/move-club/delete.service";
import { getFeatures } from "../services/feature-flags/get.service";
import { updateFeature } from "../services/feature-flags/update.service";
import { updateFeatureFlagRequestSchema } from "../model/types/feature-flag";
import { seedFeatureFlags } from "../services/feature-flags/seed.service";

const { router, procedure: baseProcedure } = initTRPC
  .context<RequestContext>()
  .create({ transformer: superjson });

const adminProcedure = baseProcedure.use(async (opts) => {
  const adminCtx = await createAdminContext(opts.ctx);
  return opts.next({ ctx: adminCtx });
});

export const adminApiRouter = router({
  users: router({
    getAll: adminProcedure.query(async () => {
      return await getUsers();
    }),
  }),
  moveClubs: router({
    getAll: adminProcedure.query(async () => {
      return await getAllMoveClubs();
    }),
    create: adminProcedure
      .input(moveClubCreateRequestSchema)
      .mutation(async ({ input }) => {
        return await createMoveClub(input);
      }),
    update: adminProcedure
      .input(z.object({ id: z.string(), input: moveClubUpdateRequestSchema }))
      .mutation(async ({ input }) => {
        return await updateMoveClub(input.id, input.input);
      }),
    getOne: adminProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getOneMoveClub(input.id);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await deleteMoveClub(input.id);
      }),
  }),
  featureFlags: router({
    getAll: adminProcedure.query(async () => {
      return await getFeatures();
    }),
    update: adminProcedure
      .input(updateFeatureFlagRequestSchema)
      .mutation(async ({ input }) => {
        return await updateFeature(input);
      }),
    seed: adminProcedure.mutation(async () => {
      return await seedFeatureFlags();
    }),
  }),
});

export type AdminApiRouter = typeof adminApiRouter;
